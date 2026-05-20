# Publicar no GitHub Pages (repositório privado)

Guia passo a passo. Tempo estimado: ~15 minutos.

---

## Pré-requisitos

- [ ] Conta no GitHub com plano **Pro / Team / Enterprise** (US$ 4/mês mínimo) — necessário para Pages em repos privados
- [ ] **Git** instalado no Windows ([download](https://git-scm.com/download/win))
- [ ] Acesso a editar arquivos nesta pasta

> **Confidencialidade:** mesmo no repo privado, qualquer pessoa convidada como colaboradora terá acesso aos dados. Compartilhe apenas com quem precisa. Se a base contiver informação interna sensível além dos CEPs públicos, considere hospedar internamente.

---

## Passo 1 — Criar o repositório no GitHub

1. Acesse https://github.com/new
2. Preencha:
   - **Repository name**: `site-base-ceps` (ou outro nome)
   - **Description**: "Consultas e dashboards da base de CEPs"
   - Marque **Private**
   - **NÃO** marque "Add a README file" (vamos enviar o nosso)
3. Clique em **Create repository**
4. Anote a URL exibida (ex.: `https://github.com/seu-usuario/site-base-ceps.git`)

## Passo 2 — Subir os arquivos

Abra o **PowerShell** ou **Git Bash** nesta pasta (Shift + clique direito → "Abrir terminal aqui") e cole os comandos abaixo, **trocando a URL pelo seu repositório**:

```bash
git init
git add .
git commit -m "Site base de CEPs - publicação inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/site-base-ceps.git
git push -u origin main
```

> **Aviso ao enviar**: o GitHub mostrará "warning: file larger than 50.00 MB" para `estados/SP.db`. Isso é apenas aviso, não erro — o push continua normalmente.

## Passo 3 — Ativar o GitHub Pages

1. No site do GitHub, abra seu repositório
2. Clique em **Settings** (engrenagem no topo)
3. No menu lateral, **Pages**
4. Em **Source**, escolha **Deploy from a branch**
5. Em **Branch**, selecione **main** e pasta **/ (root)**
6. Clique em **Save**
7. Aguarde 1-3 minutos. A URL aparecerá no topo: `https://seu-usuario.github.io/site-base-ceps/`

## Passo 4 — Compartilhar com a equipe

Como o repositório é privado, o Pages **exige login no GitHub** para acessar. Para liberar acesso a outras pessoas:

1. **Settings → Collaborators and teams → Add people**
2. Convide pelo username ou e-mail do GitHub
3. Eles recebem um convite e, após aceitar, conseguem abrir a URL do site

> Cada colaborador precisa ter conta no GitHub e estar logado para abrir o link.

---

## Atualizações futuras

Se precisar atualizar a base ou o código:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

O GitHub Pages republica automaticamente em 1-3 minutos.

---

## Alternativa: Netlify com proteção por senha

Se preferir um link com senha única (sem precisar criar contas no GitHub para cada usuário):

1. Crie conta em https://netlify.com (plano Free permite, mas password-protect só no plano **Pro** US$ 19/mês)
2. **Add new site → Deploy manually** → arraste esta pasta inteira
3. Em **Site settings → Visitor access → Password protection** → defina uma senha
4. Compartilhe URL + senha com a equipe

---

## Solução de problemas

**"GitHub Pages está desabilitado"** — confirme que sua conta está no plano Pro (https://github.com/settings/billing)

**Site carrega mas dados não aparecem** — abra DevTools (F12) → Console. Se houver erro de CORS ou MIME, abra um issue ou me chame.

**Push falha com "file too large"** — algum arquivo passou de 100 MB. Verifique com `ls -lh estados/` (Git Bash). Soluções: usar Git LFS ou comprimir o .db.

**Performance lenta no primeiro acesso** — esperado. SP.db tem 54 MB. Após o primeiro carregamento, fica em cache do navegador.
