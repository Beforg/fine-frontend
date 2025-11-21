import { FormControl } from "@angular/forms";

// Interface para tipagem do formulário de registro
export interface RegisterForm {
    nome: FormControl<string>;
    email: FormControl<string>;
    telefone: FormControl<string>;
    senha: FormControl<string>;
    confirmarSenha: FormControl<string>;
}

// Interface para os dados do formulário (valores para envio)
export interface RegisterFormData {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    confirmarSenha: string; // Incluído para validação no frontend
}

// Interface para erros de validação
export interface RegisterFormErrors {
    nome?: string;
    email?: string;
    telefone?: string;
    senha?: string;
    confirmarSenha?: string;
    general?: string;
}