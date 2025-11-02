# 🔑 Como Obter a Service Role Key

A Service Role Key é necessária para criar usuários no Supabase Authentication via API.

## 📍 Onde Encontrar:

1. Acesse: https://supabase.com/dashboard/project/thecgmdcjzoulzgxsmss
2. Vá em: **Settings** (⚙️) → **API**
3. Procure por: **Project API keys**
4. Copie a key: **`service_role`** (secret) - NÃO a `anon` key!
5. Cole no `.env.local` substituindo `SUA_SERVICE_ROLE_KEY_AQUI`

## ⚠️ Importante:

- Mantenha esta key **secreta**
- Nunca commite no Git
- Ela já está no `.gitignore`
- Só funciona no servidor (API routes)

## ✅ Após Adicionar:

Reinicie o servidor novamente e teste o cadastro de usuários!

