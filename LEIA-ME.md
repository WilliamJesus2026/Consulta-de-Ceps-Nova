# Site Base de CEPs

Webapp local para consultas e análise da base de CEPs do Brasil (1.674.585 CEPs em 5.571 cidades).

## Como rodar

1. **Dê duplo clique em `iniciar.bat`**
2. Aguarde alguns segundos — uma janela do navegador abrirá em `http://localhost:8000`
3. Para encerrar, basta fechar a janela preta (o servidor)

> ℹ️ É necessário ter o **Python 3** instalado. Caso ainda não tenha, baixe em https://www.python.org/downloads/ (marque a opção *Add Python to PATH* na instalação).

## Funcionalidades

### Dashboards
- Distribuição de CEPs por estado (gráfico de barras)
- Tabela de faixas de CEP por estado (início/fim, total de CEPs, cidades)
- Cards com totais globais (CEPs, cidades, bairros, estados)

### Consultas
- **Busca por CEP exato** — detecta automaticamente o estado pelo prefixo
- **Busca por logradouro/rua** — filtro por estado + termo (LIKE)
- **Busca por bairro** — busca insensível a acento, agrupando CEPs por bairros encontrados
- **Cidade / Estado** — listar todos CEPs de uma cidade ou estado completo, com paginação (1.000/página)

## Estrutura de arquivos

```
SITE BASE CEPS/
├── index.html               # Aplicação web
├── iniciar.bat              # Launcher (Windows)
├── meta.db                  # Cidades, bairros, faixas, stats (~8 MB)
├── dashboards.json          # Dados pré-agregados (~6 KB)
├── estados/                 # SQLite por estado (carregamento lazy)
│   ├── AC.db, AL.db, ...
│   └── SP.db (~54 MB)
├── FAIXAS CEPS RESUMIDO.xlsx  # Base original
└── LEIA-ME.md               # Este arquivo
```

## Arquitetura

- **100% local** — não envia dados para nenhum servidor externo
- **Engine SQL no navegador** (sql.js / WebAssembly)
- **Carregamento lazy** — meta.db (8 MB) carrega na abertura; a base de cada estado só é baixada quando você consulta aquele estado
- **Cache em memória** — uma vez carregado, um estado fica disponível instantaneamente até você fechar a página

## Performance

- Abertura inicial: ~2–4 segundos (carrega 8 MB)
- Primeira busca em SP (maior estado, 54 MB): ~3–8 segundos
- Buscas seguintes no mesmo estado: instantâneas
- Estados pequenos (AC, RR): praticamente instantâneo (~0.5 MB cada)
