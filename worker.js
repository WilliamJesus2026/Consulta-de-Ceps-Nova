// Worker dedicado: mantém sql.js e os bancos SQLite fora da thread principal,
// para que buscas pesadas (ex.: LIKE full-scan em SP com ~500k linhas) não travem a UI.
importScripts('https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-wasm.js');

let SQL = null;
let metaDB = null;
const estadosCache = {}; // sigla -> Database

const DB_CACHE_NAME = 'ceps-db-cache-v1';

async function getCachedBuffer(key, version) {
  try {
    const cache = await caches.open(DB_CACHE_NAME);
    const req = new Request('https://cache.local/' + key + '?v=' + version);
    const res = await cache.match(req);
    if (res) return await res.arrayBuffer();
  } catch (e) { /* Cache API indisponível — segue sem cache */ }
  return null;
}

async function putCachedBuffer(key, version, buf) {
  try {
    const cache = await caches.open(DB_CACHE_NAME);
    const req = new Request('https://cache.local/' + key + '?v=' + version);
    await cache.put(req, new Response(buf));
  } catch (e) { /* silencioso: cache é otimização, não requisito */ }
}

async function fetchAndDecompress(url, cacheKey, version) {
  if (cacheKey) {
    const cached = await getCachedBuffer(cacheKey, version);
    if (cached) return cached;
  }
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Não foi possível carregar ${url} (HTTP ${resp.status})`);
  let buf;
  if (typeof DecompressionStream !== 'undefined') {
    const ds = new DecompressionStream('gzip');
    const stream = resp.body.pipeThrough(ds);
    buf = await new Response(stream).arrayBuffer();
  } else {
    throw new Error('Navegador sem suporte a DecompressionStream nativo.');
  }
  if (cacheKey) await putCachedBuffer(cacheKey, version, buf);
  return buf;
}

function rowsToObjects(result) {
  if (!result.length) return [];
  const cols = result[0].columns;
  return result[0].values.map(v => Object.fromEntries(cols.map((c, i) => [c, v[i]])));
}

const handlers = {
  async initMeta({ version }) {
    SQL = await initSqlJs({ locateFile: f => `https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/${f}` });
    const buf = await fetchAndDecompress('meta.db.gz', 'meta.db', version);
    metaDB = new SQL.Database(new Uint8Array(buf));
  },
  async execMeta({ sql, params }) {
    return rowsToObjects(metaDB.exec(sql, params || []));
  },
  async loadEstado({ sigla, version }) {
    if (estadosCache[sigla]) return true;
    const buf = await fetchAndDecompress(`${sigla}.db.gz`, `${sigla}.db`, version);
    estadosCache[sigla] = new SQL.Database(new Uint8Array(buf));
    return true;
  },
  async execEstado({ sigla, sql, params }) {
    const db = estadosCache[sigla];
    if (!db) throw new Error(`Estado ${sigla} não carregado ainda.`);
    return rowsToObjects(db.exec(sql, params || []));
  },
};

self.onmessage = async (ev) => {
  const { id, type, payload } = ev.data;
  try {
    const fn = handlers[type];
    if (!fn) throw new Error('Tipo de mensagem desconhecido: ' + type);
    const result = await fn(payload || {});
    self.postMessage({ id, ok: true, result });
  } catch (e) {
    self.postMessage({ id, ok: false, error: e.message || String(e) });
  }
};
