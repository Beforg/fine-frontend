import { FormControl } from "@angular/forms";

export interface AgendamentoForm {
    data: FormControl<string>;
    servicos: FormControl<number[]>;
    produtos: FormControl<number[]>;
}