import { Component, Input } from '@angular/core';
import { AgendamentoComponent } from "../../../pages/agendamento/agendamento.component";
import { AgendamentosComponent } from "../agendamentos/agendamentos.component";
import { I } from '@angular/cdk/keycodes';
import { GerenciamentoComponent } from "../gerenciamento/gerenciamento.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ServicosComponent } from "../servicos/servicos.component";

@Component({
  selector: 'app-main-gerenciamento',
  imports: [AgendamentosComponent, GerenciamentoComponent, SidebarComponent, ServicosComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  @Input() showGerenciamento: boolean = false;
  @Input() showAgendamentos: boolean = true;
}
