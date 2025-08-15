import { FormControl } from "@angular/forms";

export interface PerfilForm {
    nome: FormControl<string>;
    email: FormControl<string>;
    telefone: FormControl<string>;
    senha: FormControl<string>;
}