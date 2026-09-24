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