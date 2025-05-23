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

1. Clone o repositório do frontend:

```bash
git clone https://github.com/VivianSTWu/MeuCalendario-Odontoprev.git
```

2. Clone o repositório do backend:

```bash
git clone https://gitlab.com/VivianSTWu/meucalendario-api/
```

3. Execute ambos os projetos e faça login com o usuário:

```bash
{
    "email": "matheus@email.com",
    "password": "senha123"
}
```

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
- 🗣️ Pitch Inicial: [Youtube](https://www.youtube.com/watch?v=jUbJweG8XMY)
- 📱 Demonstração da Aplicação: [Youtube](https://www.youtube.com/watch?v=jUbJweG8XMY)
- 📊 Sprint Final: [Youtube](https://www.youtube.com/watch?v=zd22tz-3sYU)

## 📌 Considerações Finais
Este projeto foi desenvolvido como parte da disciplina de Desenvolvimento Mobile. O foco principal foi construir um MVP funcional para resolver um problema real apresentado pela Odontoprev, promovendo saúde bucal com tecnologia e experiência do usuário.

© 2025 - Grupo KCIAO | FIAP - 2TDSPR
