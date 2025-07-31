import { FormControl } from '@angular/forms';

// Interface para tipagem do formulário de login
export interface LoginForm {
  login: FormControl<string>;
  senha: FormControl<string>;
}

// Interface para os dados do formulário (valores)
export interface LoginFormData {
  login: string;
  senha: string;
}

// Interface para resposta RAW do back-end (como está chegando)
export interface BackendLoginResponse {
  token: string;
  email: string;
  role: string;
}

// Interface para resposta do front-end (padronizada)
export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    email: string;
    role: string;
  };
  message?: string;
}

// Interface para erros de validação
export interface LoginFormErrors {
  login?: string;
  senha?: string;
  general?: string;
}
