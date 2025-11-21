import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-sidebar-gerenciamento',
  imports: [MatIconModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() userName!: string;
  @Input() userRole!: string;
  @Input() showGerenciamento!: boolean;
  @Input() showAgendamentos!: boolean;
  @Output() navigateToGerenciamento = new EventEmitter<void>();
  @Output() navigateToAgendamentos = new EventEmitter<void>();
  @Output() voltar = new EventEmitter<void>();


  handleNavigateToGerenciamento() {
    this.navigateToGerenciamento.emit();
  }

  handleNavigateToAgendamentos() {
    this.navigateToAgendamentos.emit();
  }

  handleVoltar() {
    this.voltar.emit();
  }

}
