import { FormControl } from "@angular/forms";

export interface RegisterForm {
    nome: FormControl<string>;
    email: FormControl<string>;
    telefone: FormControl<string>;
    senha: FormControl<string>;
    confirmarSenha: FormControl<string>;
}

export interface RegisterFormData {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
}