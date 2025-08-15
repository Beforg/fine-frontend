import { Component, Input } from '@angular/core';
import { AgendamentosComponent } from "../agendamentos/agendamentos.component";
import { GerenciamentoComponent } from "../gerenciamento/gerenciamento.component";

@Component({
  selector: 'app-main-gerenciamento',
  imports: [AgendamentosComponent, GerenciamentoComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  @Input() showGerenciamento: boolean = false;
  @Input() showAgendamentos: boolean = true;

  sectionTitle(): string {
    if (this.showGerenciamento) {
      return 'Gerenciamento';
    } else if (this.showAgendamentos) {
      return 'Agendamentos';
    }
    return '';
  }
}
