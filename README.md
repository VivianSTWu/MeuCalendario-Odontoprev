# 🦷 Meu Calendário - Odontoprev

## 👥 Grupo KCIAO - 2TDSPR

**Integrantes:**
- RM 553791 - Jhonatan Sampaio Ferreira  
- RM 553169 - Vivian Sy Ting Wu  
- RM 553471 - Gustavo Vieira Bargas  

---

## 📌 Visão Geral do Projeto

Este projeto é a interface **frontend** do sistema desenvolvido para o desafio proposto pela **Odontoprev**, com foco em **engajamento e prevenção da saúde bucal** dos clientes por meio de lembretes personalizados.

A aplicação se conecta com uma API (desenvolvida em Java e hospedada no Azure) que gerencia os registros de consultas, eventos e dados dos clientes.

---

## 🎯 Objetivo

A proposta da aplicação é auxiliar os clientes da Odontoprev no cuidado contínuo com a saúde bucal, por meio de um calendário inteligente. A cada nova interação com o sistema (ex: realização de uma consulta ou troca da escova), o app recalcula e envia novas recomendações e lembretes ao usuário.

---

## 🧰 Tecnologias Utilizadas

- **Framework:** React Native  
- **API:** [MeuCalendario-API](https://gitlab.com/VivianSTWu/meucalendario-api/)

---

## 📲 Funcionalidades

- [x] Cadastro de novo cliente  
- [x] Exibição de próximos eventos no calendário
- [x] Sugestão de próximos eventos no calendário  
- [x] Registro de ações como consultas e trocas de escova  
- [x] Atualização de lembretes com base nas ações do usuário  
- [x] Visualização de histórico de eventos  

---

## 🚀 Como Executar o Projeto

### ✔️ Pré-requisitos

- Node.js  
- Expo CLI  
- Yarn ou npm  
- Celular com o app **Expo Go** instalado ou um emulador Android/iOS  
- Editor de código (VS Code recomendado para o frontend e IntelliJ para o backend)

### 📦 Instalação

### 1. Clone o repositório do frontend:

```bash
git clone https://github.com/VivianSTWu/MeuCalendario-Odontoprev.git
```

### 2. Na IDE, abra um terminal e entre na pasta MeuCalendario:

```bash
cd .\MeuCalendario
```
   
![image](https://github.com/user-attachments/assets/5df65aa8-8684-4473-9e0d-00e55d30ddb2)

### 3. Rode o comando para instalar as dependências:

- Se utiliza npm:
```bash
npm install
```
- Se utiliza yarn:
```bash
yarn
```

### 4. Inicie o projeto:

```bash
npx expo start
```
Isso abrirá o servidor Expo, o que permitirá rodar o projeto no emulador ou dispositivo.

### 5. Troque para o Expo Go (pressione 'S'):

![image](https://github.com/user-attachments/assets/f553e31d-a206-43c1-8822-76f03c962424)

### 6. Abra o projeto
Abra o aplicativo em um emulador ou em seu dispositivo móvel, utilizando o aplicativo Expo Go (talvez seja necessário instalá-lo e fazer o login)

### 7. Na tela de login, utilize essas credenciais:
```bash
{
    "email": "larissa@email.com",
    "password": "senha123"
}
```
---

### ❌ Caso, por algum motivo, o web app com a api esteja fora do ar, siga estes passos:

### A. clone o repositório de backend ([link do repositório](https://gitlab.com/VivianSTWu/meucalendario-api/))

```bash
git clone https://gitlab.com/VivianSTWu/meucalendario-api.git
```
### B. Abra o projeto em uma IDE (recomendamos o IntelliJ) e rode a aplicação (src/main/java/fiap_2tdspr.kciao/KciaoJavaApplication)

![image](https://github.com/user-attachments/assets/4399f39b-a13d-4bde-93ec-a036c3067813)


### C. Abra o projeto de frontend (já clonado no passo 1 para a execução da solução), e edite o arquivo **api.ts** (MeuCalendario-Odontoprev/MeuCalendario/services/api.ts)

Altere a linha 
```bash
baseURL: 'https://meucalendarioodontoprev.azurewebsites.net', 
```

por
```bash
baseURL: 'http://localhost:8080', 
```

![image](https://github.com/user-attachments/assets/946d3440-8151-46f3-ade9-5062143b789d)


### D. No terminal onde você ligou o servidor do Expo, pressione 'R' para recarregar a aplicação, ou siga os passos 4, 5, 6 e 7 novamente.


---

## 📁 Estrutura de Pastas
MeuCalendario-Odontoprev/ </br>
├── assets/               # Ícones e imagens </br>
├── components/           # Componentes reutilizáveis </br>
├── screens/              # Telas principais do app </br>
├── services/             # Arquivos de conexão com a API </br>
├── App.js                # Arquivo principal da aplicação </br>
└── README.md             # Documentação do projeto </br>

## 🔗 Repositórios
- Frontend: [VivianSTWu/MeuCalendario-Odontoprev](https://github.com/VivianSTWu/MeuCalendario-Odontoprev)
- Backend: [JhonatanSampaioF/KCIAOJava](https://gitlab.com/VivianSTWu/meucalendario-api/)

## 🎥 Vídeos de Apresentação
- 📱 Demonstração da Aplicação: [Youtube](https://youtu.be/ltTQRQdSNnA)
- 📊 Sprint Final: [Youtube](https://www.youtube.com/watch?v=zd22tz-3sYU)

## 📌 Considerações Finais
Este projeto foi desenvolvido como parte da disciplina de Desenvolvimento Mobile. O foco principal foi construir um MVP funcional para resolver um problema real apresentado pela Odontoprev, promovendo saúde bucal com tecnologia e experiência do usuário.

© 2025 - Grupo KCIAO | FIAP - 2TDSPR
