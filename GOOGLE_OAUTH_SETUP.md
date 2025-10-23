# Google OAuth2 Setup Guide

## Configuração do Google OAuth2

### 1. Console do Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para **APIs & Services > Credentials**
4. Clique em **Create Credentials > OAuth client ID**

### 2. Configuração do OAuth Client ID

**Tipo de aplicação:** Web application

**Origens JavaScript autorizadas:**
```
http://localhost:3000
http://localhost:5173
http://localhost:4173
```

**URIs de redirecionamento autorizados:**
```
http://localhost:3000
http://localhost:5173
http://localhost:4173
```

### 3. Configuração do Ambiente

Copie o Client ID gerado e adicione ao arquivo `.env`:

```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Configuração da API

Certifique-se de que as seguintes APIs estão habilitadas no Google Cloud Console:

- **Google+ API** (para informações do perfil)
- **Google OAuth2 API**

### 5. Fluxo de Autenticação

#### Frontend (React)
1. Usuário clica em "Entrar com Google"
2. Popup do Google OAuth abre
3. Usuário autoriza a aplicação
4. Google retorna access token
5. Frontend obtém informações do usuário (nome, email)
6. Frontend envia dados para backend

#### Backend Integration
O componente `GoogleLoginButton` envia para o endpoint `/auth/google`:

```typescript
interface GoogleLoginRequest {
  idToken: string;
  name: string;
  lastname: string;
}

interface GoogleAuthResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
  user: User;
}
```

### 6. Implementação

#### Componentes Criados
- `GoogleLoginButton` - Botão de login com Google
- Integração no `AuthProvider` - Hook `googleLogin`
- Página de Login atualizada com botão Google

#### Funcionalidades
- ✅ Login com Google OAuth2
- ✅ Obtenção automática de nome e sobrenome
- ✅ Integração com sistema de autenticação existente
- ✅ Tratamento de erros
- ✅ Estados de loading
- ✅ Redirecionamento após sucesso

### 7. Uso

```tsx
import { GoogleLoginButton } from '../components/GoogleLoginButton';

<GoogleLoginButton
  onSuccess={() => navigate('/')}
  onError={(error) => setError(error)}
  disabled={isSubmitting}
/>
```

### 8. Segurança

⚠️ **IMPORTANTE:**
- O Client Secret nunca deve ser exposto no frontend
- Em produção, configure domínios corretos no Google Console
- Use HTTPS em produção
- Valide tokens no backend

### 9. Debugging

Para debugar problemas:

1. Verifique o console do navegador
2. Certifique-se de que o Client ID está correto
3. Verifique se os domínios estão configurados no Google Console
4. Teste em modo incógnito para evitar cache

### 10. Produção

Para deploy em produção:

1. Adicione o domínio de produção nas origens autorizadas
2. Configure a variável `VITE_GOOGLE_CLIENT_ID` no ambiente de produção
3. Use HTTPS obrigatoriamente
4. Configure CORS adequadamente no backend
