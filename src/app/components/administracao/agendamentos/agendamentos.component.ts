import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AgendamentoService } from '../../../services/agendamento.service';
import { AuthService } from '../../../services/auth.service';
import { AgendamentoStatus } from '../../../enums/agendamento-status.enum';
import { UserRole } from '../../../enums/user-role.enum';
import {MatRadioModule} from '@angular/material/radio'
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

// Interfaces para tipagem
interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracaoMinutos: number;
  descricao: string;
  ativo: boolean;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

interface Agendamento {
  id: number;
  nomeCliente: string;
  nomeBarbeiro: string;
  servicos: Servico[];
  produtos: Produto[];
  dataHoraInicio: string;
  status: string;
  foiGratis: boolean;
  observacoes: string;
  barbaGratis: boolean;
  sobrancelhaGratis: boolean;
}


@Component({
  selector: 'app-agendamentos-gerenciamento',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule
  ],
  templateUrl: './agendamentos.component.html',
  styleUrl: './agendamentos.component.scss'
})
export class AgendamentosComponent implements OnInit {
  @Input() showAgendamentoContainer: boolean = false;
  // Dados da tabela
  agendamentos: Agendamento[] = [];
  agendamentosFiltrados: Agendamento[] = [];
  barbeiroId: string = "";
  showAgendamentoInfo: boolean = false;
  agendamentoSelecionado: Agendamento | null = null;
  // Paginação
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  
  // Para exposição no template
  Math = Math;
  filtroSelecionado: string = 'Agendado';

  constructor(
    private agendamentoService: AgendamentoService, 
    private authService: AuthService,
    private notification: NotificationService) { }

  ngOnInit(): void {
    // Debug: informações do usuário
    const currentUser = this.authService.getCurrentUser();
    
    this.loadAgendamentos();
    if (currentUser?.role === UserRole.BARBEIRO) {
      this.barbeiroId = currentUser?.id || "";
    }
  }

  toggleAgendamentoInfo(): void {
    this.showAgendamentoInfo = !this.showAgendamentoInfo;
  }

  filtrarAgendamentos(): void {
    this.loadAgendamentos();
  }

  visualizarAgendamento(agendamento: Agendamento): void {
    this.agendamentoSelecionado = agendamento;
    this.showAgendamentoInfo = true;
  }

  toggleDetalhes(agendamento: Agendamento): void {
    if (this.agendamentoSelecionado?.id === agendamento.id) {
      this.agendamentoSelecionado = null;
    } else {
      this.agendamentoSelecionado = agendamento;
    }
  }

  // Verificar se o usuário tem permissão para alterar status
  hasPermissionToChangeStatus(): boolean {
    const currentUser = this.authService.getCurrentUser();
    const userRole = currentUser?.role;
    return userRole === UserRole.ADMIN || userRole === UserRole.BARBEIRO;
  }

// Trocar o id pelo selecionado (Pelo ADMIN somente)
  loadAgendamentos() {
    const data = {
      id: "7", 
      page: (this.currentPage + 1).toString(), 
      size: this.pageSize.toString(),
      filtro: this.filtroSelecionado
    };
    this.agendamentoService.listarAgendamentos(data).subscribe({
      next: (response) => {
        this.agendamentos = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.agendamentosFiltrados = [...this.agendamentos]; // Inicialmente sem filtro
      },
      error: (error) => {
        this.notification.error(error.error.message || "Erro ao carregar agendamentos.");
      }
    });
  }
   
  // Calcular total do agendamento
  calculateTotal(agendamento: Agendamento): number {
    const totalServicos = agendamento.servicos.reduce((sum, servico) => sum + servico.preco, 0);
    const totalProdutos = agendamento.produtos.reduce((sum, produto) => sum + (produto.preco * produto.quantidade), 0);
    return totalServicos + totalProdutos;
  }

  calculateServiceTime(agendamento: Agendamento): number {
    return agendamento.servicos.reduce((total, servico) => total + servico.duracaoMinutos, 0);
  }

  // Obter classe CSS para status
  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'AGENDADO':
        return 'status-agendado';
      case 'REALIZADO':
        return 'status-concluido';
      case 'CANCELADO':
        return 'status-cancelado';
      default:
        return 'status-default';
    }
  }

  // Navegação de páginas
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAgendamentos(); // Recarregar dados da nova página
    }
  }

  finalizarAgendamento(id: number): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('🔄 Tentando finalizar agendamento:', {
      agendamentoId: id,
      usuario: currentUser?.name,
      role: currentUser?.role,
      userId: currentUser?.id
    });

    // Verificar permissão primeiro
    if (!this.hasPermissionToChangeStatus()) {
      alert('Você não tem permissão para realizar esta ação.');
      return;
    }
    let comprouProdutos!: boolean;
    if (window.confirm('O cliente comprou produtos junto com o serviço?')) {
      comprouProdutos = true;
    } else {
      comprouProdutos = false;
    }

    this.agendamentoService.alterarStatusAgendamento(AgendamentoStatus.REALIZADO, id.toString(), comprouProdutos).subscribe({
      next: (response) => {
        console.log('✅ Agendamento finalizado com sucesso:', response);
        this.showAgendamentoInfo = false; // Fechar modal
        this.notification.success("Agendamento finalizado com sucesso!");
        this.loadAgendamentos();
      },
      error: (error) => {
        this.notification.error(error.error.message || "Erro ao finalizar agendamento.");
      }
    });
  }

  cancelarAgendamento(id: number): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    this.agendamentoService.alterarStatusAgendamento(AgendamentoStatus.CANCELADO, id.toString(), false).subscribe({
      next: (response) => {
        this.notification.success("Agendamento cancelado com sucesso!");
        this.showAgendamentoInfo = false; // Fechar modal
        this.loadAgendamentos();
      },
      error: (error) => {
        this.notification.error(error.error.message || "Erro ao cancelar agendamento.");
      }
    });
  }
private politicaCancelamentoAgendamento(agendamento: Agendamento): boolean {
  const currentUser = this.authService.getCurrentUser();
  const userRole = currentUser?.role;

  // ADMIN e BARBEIRO podem cancelar a qualquer hora
  if (userRole === UserRole.ADMIN || userRole === UserRole.BARBEIRO) {
    return true;
  }

  // CLIENTE só pode cancelar até 1 hora antes do agendamento
  if (userRole === UserRole.CLIENTE) {
    const dataAgendamento = new Date(agendamento.dataHoraInicio);
    const agora = new Date();
    
    const diferencaMs = dataAgendamento.getTime() - agora.getTime();
    

    const diferencaHoras = diferencaMs / (1000 * 60 * 60);
    
    return diferencaHoras > 1;
  }

  // padrão, não permite cancelamento
  return false;
}

}
