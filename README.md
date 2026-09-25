# Barbearia Fine

Plataforma web desenvolvida para digitalizar o agendamento e a gestão da Barbearia Fine.

A aplicação oferece uma experiência responsiva para clientes, permitindo cadastro, autenticação e agendamento de serviços, enquanto o backend gerencia as regras de negócio e a disponibilidade de horários.

O backend encontra-se atualmente desativado. 

## Funcionalidades

- Cadastro e autenticação de clientes
- Gerenciamento de perfil
- Agendamento de serviços
- Consulta de disponibilidade de horários
- Gerenciamento de serviços e profissionais
- Interface responsiva para desktop e mobile
- Sistema de notificações em tempo real
- Armazenamento de imagens e mídias
- Autenticação e autorização com JWT

## Tecnologias

### Frontend
- Angular
- TypeScript
- Angular Material
- SCSS
- SPA (Single Page Application)

### Backend
- Java
- Spring Boot
- Spring Security
- JWT
- WebSocket

### Banco de Dados
- PostgreSQL (AWS RDS)

### Infraestrutura
- AWS Elastic Beanstalk
- AWS S3
- AWS CloudFront
- AWS Route 53

### Desenvolvimento da Interface

A **UI (HTML e SCSS) do frontend foi delegada à Inteligência Artificial**, utilizada para geração e refinamento da interface visual, componentes e estilos responsivos.


## Arquitetura

```text
Cliente
   │
   ▼
Angular (SPA)
   │
   ▼
Spring Boot API
   │
   ├── PostgreSQL (AWS RDS)
   ├── AWS S3
   └── WebSocket
```