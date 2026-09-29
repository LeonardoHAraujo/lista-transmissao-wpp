<div align="center">
  <h1 align="center">serverless-wpp-send-message</h1>
  <p align="center">Responsável pelo envio de notificações via whatsapp</p>
</div>

<br />

<div align="center">

  ### Table of Contents
  [1. Preparação do ambiente](#environment)

</div>

<br />
<a name="environment" />
<h2 align=""><b>Preparação do ambiente</b></h2>

1. Instalar as dependencias:
  ```bash
  $  npm install
  ```
  <br/>
  <br/>

2. Configuração de banco de dados:
  1. Tenha certeza que o Docker está instalado corretamente na máquina e rodando
  2. Configurar o arquivo ```.env``` com os dados necessários ( ver ```.env.example``` )

3. Rodar localmente:
  1. Rodar ```npm run build```
  2. Rodar ```npm run dev```

<br />
<a name="broadcast" />
<h2 align=""><b>Disparo a partir de grupo (lista nativa Z-API)</b></h2>

Quando alguém envia uma imagem (com ou sem caption) ou um texto no grupo monitorado, o webhook lista as listas de transmissão, filtra as de `BROADCAST_IDS`, publica um número por mensagem no SQS e um segundo lambda envia para cada número.

Endpoint: `POST /webhooks/z-api/received/{Z_API_WEBHOOK_SECRET}`

- Imagem com caption usa `send-image` com caption.
- Imagem sem caption usa `send-image`.
- Texto usa `send-text`.

### Checklist de setup Z-API

1. Criar uma ou mais listas de transmissão e cadastrar os contatos (painel ou [create-broadcast](https://developer.z-api.io/broadcast/create-broadcast)). Listas nativas costumam ficar perto de 256 contatos; para ~500+, use duas ou mais e coloque os ids em `BROADCAST_IDS` separados por vírgula (ex.: `1779474934@broadcast,1779475000@broadcast`).
2. Descobrir o id do grupo de origem (webhook de teste ou busca de grupos na API) e gravar em `SOURCE_GROUP_ID` (ex.: `120363019502650977-group`). A instância precisa estar nesse grupo.
3. Definir `Z_API_WEBHOOK_SECRET` (valor aleatório longo). No deploy de produção, o mesmo valor precisa existir como secret no GitHub Actions, junto com `SOURCE_GROUP_ID`, `BROADCAST_IDS`, `IGNORE_FROM_ME` e, se usado, `ALLOWED_PARTICIPANT_PHONES`.
4. Depois do deploy, configurar o webhook **Ao receber** da instância para a URL HTTPS:
   `https://{apiId}.execute-api.{region}.amazonaws.com/webhooks/z-api/received/{Z_API_WEBHOOK_SECRET}`
   Sem esse webhook, o endpoint [forward-message](https://developer.z-api.io/message/forward-message) não encaminha.
5. `IGNORE_FROM_ME` fica `true` por padrão (ignora mensagens do próprio número). Se o post de origem for feito pelo número conectado, habilitar “notificar enviadas por mim” na Z-API e setar `IGNORE_FROM_ME=false`.
6. Teste real: enviar **uma** imagem ou texto no grupo e conferir o recebimento em 1–2 números das listas antes de usar a base completa.

Eventos que não são imagem ou texto do grupo configurado respondem `200` e são ignorados. Falha ao listar as listas ou ao publicar na fila responde `500`. Falha de envio em um número volta para a fila e, após 3 tentativas, vai para a DLQ.