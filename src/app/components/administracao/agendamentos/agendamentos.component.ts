import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AgendamentoService } from '../../../services/agendamento.service';
import { AuthService } from '../../../services/auth.service';
import { AgendamentoStatus } from '../../../enums/agendamento-status.enum';
import { UserRole } from '../../../enums/user-role.enum';

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
}


@Component({
  selector: 'app-agendamentos-gerenciamento',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './agendamentos.component.html',
  styleUrl: './agendamentos.component.scss'
})
export class AgendamentosComponent implements OnInit {
  @Input() showAgendamentoContainer: boolean = false;
  // Dados da tabela
  agendamentos: Agendamento[] = [];
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

  constructor(private agendamentoService: AgendamentoService, private authService: AuthService) { }

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

  visualizarAgendamento(agendamento: Agendamento): void {
    this.agendamentoSelecionado = agendamento;
    this.showAgendamentoInfo = true;
  }

  // Verificar se o usuário tem permissão para alterar status
  hasPermissionToChangeStatus(): boolean {
    const currentUser = this.authService.getCurrentUser();
    const userRole = currentUser?.role;
    
    console.log('🔍 Verificando permissão:', {
      role: userRole,
      isAdmin: userRole === UserRole.ADMIN,
      isBarbeiro: userRole === UserRole.BARBEIRO
    });
    
    return userRole === UserRole.ADMIN || userRole === UserRole.BARBEIRO;
  }

// Trocar o id pelo selecionado (Pelo ADMIN somente)
  loadAgendamentos(): void {
    const data = {id: "7", page: (this.currentPage + 1).toString(), size: this.pageSize.toString()};
    this.agendamentoService.listarAgendamentos(data).subscribe({
      next: (response) => {
        this.agendamentos = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.error('Erro ao carregar agendamentos:', error);
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

    this.agendamentoService.alterarStatusAgendamento(AgendamentoStatus.REALIZADO, id.toString()).subscribe({
      next: (response) => {
        console.log('✅ Agendamento finalizado com sucesso:', response);
        this.showAgendamentoInfo = false; // Fechar modal
        this.loadAgendamentos();
      },
      error: (error) => {
        console.error('❌ Erro ao finalizar agendamento:', error);
        console.error('📊 Detalhes completos do erro:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
          url: error.url
        });
        
        // Mostrar mensagem específica baseada no status
        if (error.status === 403) {
          console.error('ACESSO NEGADO: O servidor rejeitou a requisição');
          alert('Acesso negado. Verifique suas permissões.');
        }
      }
    });
  }

  cancelarAgendamento(id: number): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('🔄 Tentando cancelar agendamento:', {
      agendamentoId: id,
      usuario: currentUser?.name,
      role: currentUser?.role,
      userId: currentUser?.id
    });

    // Verificar permissão primeiro
    if (!this.hasPermissionToChangeStatus()) {
      console.error('PERMISSÃO NEGADA: Usuário não tem permissão para alterar status de agendamentos');
      console.error('Roles permitidos: ADMIN, BARBEIRO. Role atual:', currentUser?.role);
      alert('Você não tem permissão para realizar esta ação.');
      return;
    }

    this.agendamentoService.alterarStatusAgendamento(AgendamentoStatus.CANCELADO, id.toString()).subscribe({
      next: (response) => {
        console.log('✅ Agendamento cancelado com sucesso:', response);
        this.showAgendamentoInfo = false; // Fechar modal
        this.loadAgendamentos();
      },
      error: (error) => {
        // Mostrar mensagem específica baseada no status
        if (error.status === 403) {
          console.error('ACESSO NEGADO: O servidor rejeitou a requisição');
          console.error('Possíveis causas: Token inválido, role insuficiente, ou agendamento não pertence ao usuário');
          alert('Acesso negado. Verifique suas permissões.');
        }
      }
    });
  }

}
