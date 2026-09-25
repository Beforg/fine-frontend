import { Component, OnInit } from '@angular/core';
import { FinanceiroService } from '../../../services/financeiro.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoadingComponent } from '../../loading/loading.component';
import { NotificationService } from '../../../services/notification.service';

export interface FinanceiroDTO {
  receitaTotal: number;
  cortesTotais: number;
  agendamentosRealizadosPorBarbeiro: Record<string, number>;
  receitaTotalPorBarbeiro: Record<string, number>;
  bonificacaoPorBarbeiro: Record<string, number>;
}

@Component({
  selector: 'app-financeiro',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoadingComponent
  ],
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.scss'
})
export class FinanceiroComponent implements OnInit {
  isLoading: boolean = false;
  dadosFinanceiros: FinanceiroDTO | null = null;
  periodoForm!: FormGroup;
  maxDate = new Date();

  constructor(
    private financeiroService: FinanceiroService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    this.periodoForm = this.fb.group({
      dataInicio: [primeiroDiaMes, Validators.required],
      dataFim: [hoje, Validators.required]
    });
  }

  get f() {
    return this.periodoForm.controls;
  }

  buscarDadosPorPeriodo(): void {
    if (this.periodoForm.invalid) {
      this.notificationService.error('Preencha as datas corretamente');
      return;
    }

    const dataInicio = this.formatDate(this.f['dataInicio'].value);
    const dataFim = this.formatDate(this.f['dataFim'].value);

    if (new Date(dataInicio) > new Date(dataFim)) {
      this.notificationService.error('Data de início não pode ser maior que data final');
      return;
    }

    this.isLoading = true;
    this.financeiroService.obterReceitaPorPeriodo(dataInicio, dataFim).subscribe({
      next: (dados) => {
        this.dadosFinanceiros = dados;
        this.isLoading = false;
        this.notificationService.success('Dados carregados com sucesso!', dados);
      },
      error: (error) => {
        console.error('Erro ao buscar dados financeiros:', error);
        this.isLoading = false;
        this.notificationService.error('Erro ao buscar dados financeiros');
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  getBarberNames(): string[] {
    if (!this.dadosFinanceiros) return [];
    return Object.keys(this.dadosFinanceiros.agendamentosRealizadosPorBarbeiro);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}
