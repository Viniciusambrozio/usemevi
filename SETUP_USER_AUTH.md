# Sistema de Autenticação de Usuários

## 📋 Configuração Inicial

### 1. Execute o Script SQL no Supabase

1. Acesse https://supabase.com
2. Vá em **SQL Editor**
3. Execute o script `sql/08-add-password-to-clients.sql`:

```sql
-- Adiciona coluna de senha na tabela clients para autenticação
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS password TEXT;

COMMENT ON COLUMN clients.password IS 'Senha do cliente (em produção deve ser hasheada)';

-- Atualiza email para ser único
ALTER TABLE clients 
ADD CONSTRAINT clients_email_unique UNIQUE (email);
```

## ✨ Funcionalidades Implementadas

### 🎭 **Modal de Boas-Vindas**
- Aparece automaticamente após 1 segundo se o usuário não estiver logado
- Design moderno com gradiente rosa
- Ícone de sparkles amarelo
- Mensagem amigável: "Oii! 👋 Preciso de apenas algumas informações para continuarmos"

### 📝 **Formulário de Cadastro**
- **Nome** (campo de texto)
- **Email** (validação de email)
- **Senha** (mínimo 6 caracteres)
- Botão "Criar Conta" rosa vibrante

### 🔐 **Sistema de Login**
- Toggle entre "Criar Conta" e "Fazer Login"
- Validação de email existente
- Armazenamento seguro no localStorage
- Hook `useAuth` para gerenciar estado

### 💾 **Armazenamento**
- Dados salvos na tabela `clients`
- Sessão mantida no `localStorage` como `mevi-user`
- Sincronização automática entre abas

## 🎯 Como Funciona

### **Fluxo de Cadastro:**
1. Usuário acessa pela primeira vez
2. Modal aparece após 1 segundo
3. Preenche Nome, Email e Senha
4. Clica em "Criar Conta"
5. Dados salvos em `clients`
6. Usuário automaticamente logado

### **Fluxo de Login:**
1. Clica em "Já tem conta? Faça login"
2. Preenche Email e Senha
3. Sistema valida credenciais
4. Usuário logado

### **Benefícios:**
- ✅ Favoritos salvos por usuário
- ✅ Histórico de pedidos personalizado
- ✅ Experiência personalizada
- ✅ Dados persistentes

## 🔧 Hook useAuth

```typescript
const { user, isAuthenticated, login, logout } = useAuth();

// user: dados do usuário logado
// isAuthenticated: boolean se está logado
// login(userData): função para fazer login
// logout(): função para sair
```

## ⚠️ Nota de Segurança

**IMPORTANTE:** Este sistema armazena senhas em **texto puro** para simplicidade.

**Em produção, você DEVE:**
- Usar bcrypt ou similar para hash de senhas
- Implementar autenticação JWT ou session-based
- Usar HTTPS
- Adicionar rate limiting
- Implementar recuperação de senha

## 🎨 Design

O modal segue o design do projeto:
- Gradiente rosa (#fc0055 → #ff1a6b)
- Ícone amarelo (#ffe472)
- Bordas arredondadas
- Animações suaves
- Campos com foco rosa

