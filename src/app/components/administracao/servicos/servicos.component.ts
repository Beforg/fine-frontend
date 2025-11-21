import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Servico, CadastroServico } from '../../../interfaces/entities.interface';
import { ServicoService } from '../../../services/servico.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-servicos-gerenciamento',
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.scss'
})
export class ServicosComponent implements OnInit {
  servicos: Servico[] = [];
  modalAberto = false;
  servicoSelecionado: Servico | null = null;
  novoServico: Partial<Servico> = {};

  constructor(
    private servicoService: ServicoService,
    private notificationService: NotificationService
  ) {
    
  }

  ngOnInit() {
    this.carregarServicos();
  }

  carregarServicos() {
    // Carregando serviços do backend
    this.servicoService.getServicos().subscribe(servicos => {
      this.servicos = servicos;
    });
  }

  abrirModal(servico?: Servico) {
    if (servico) {
      this.servicoSelecionado = servico;
      this.novoServico = { ...servico };
    } else {
      this.servicoSelecionado = null;
      this.novoServico = {
        nome: '',
        descricao: '',
        preco: 0,
        duracaoMinutos: 0,
        ativo: true
      };
    }
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.servicoSelecionado = null;
    this.novoServico = {};
  }

  salvarServico() {
    // Validações básicas
    if (!this.novoServico.nome || !this.novoServico.nome.trim()) {
      this.notificationService.validationError('O nome do serviço é obrigatório');
      return;
    }

    if (!this.novoServico.descricao || !this.novoServico.descricao.trim()) {
      this.notificationService.validationError('A descrição do serviço é obrigatória');
      return;
    }

    if (!this.novoServico.preco || this.novoServico.preco <= 0) {
      this.notificationService.validationError('O preço deve ser maior que zero');
      return;
    }

    if (!this.novoServico.duracaoMinutos || this.novoServico.duracaoMinutos <= 0) {
      this.notificationService.validationError('A duração deve ser maior que zero');
      return;
    }

    if (this.servicoSelecionado) {
      // Editar serviço existente
      const servicoCompleto: Servico = {
        ...this.servicoSelecionado,
        ...this.novoServico
      } as Servico;
      
      this.servicoService.editarServico(servicoCompleto).subscribe(response => {
        if (response) {
          this.carregarServicos();
          this.notificationService.success(`Serviço "${this.novoServico.nome}" editado com sucesso!`);
        } else {
          this.notificationService.error('Erro ao editar serviço');
        }
      });
    } else {
      // Adicionar novo serviço
      const novoServico: CadastroServico = {
        nome: this.novoServico.nome!,
        descricao: this.novoServico.descricao!,
        preco: this.novoServico.preco!,
        duracaoMinutos: this.novoServico.duracaoMinutos!
      };
      
      this.servicoService.cadastrarServico(novoServico).subscribe(response => {
        if (response.httpStatus === "CREATED") {
          this.carregarServicos();
          this.notificationService.success(`Serviço "${this.novoServico.nome}" cadastrado com sucesso!`);
        } else {
          this.notificationService.error(response.message || 'Erro ao cadastrar serviço');
        }
      });
    }

    this.fecharModal();
  }

  editarServico(servico: Servico) {
    this.abrirModal(servico);
  }

  removerServico(servico: Servico) {
    if (confirm(`Tem certeza que deseja remover o serviço "${servico.nome}"?`)) {
      const index = this.servicos.findIndex(s => s.id === servico.id);
      if (index !== -1) {
        this.servicos.splice(index, 1);
      }
    }
  }

  adicionarServico() {
    this.abrirModal();
  }

  formatarPreco(preco: number): string {
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
  }

  formatarDuracao(minutos: number): string {
    if (minutos < 60) {
      return `${minutos} min`;
    } else {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
    }
  }

  // =============================================
  // MÉTODOS AUXILIARES
  // =============================================
  toggleStatus(servico: Servico): void {
    const novoStatus = !servico.ativo;
    const statusTexto = novoStatus ? 'ativado' : 'desativado';
    
    this.servicoService.editarServico({ ...servico, ativo: novoStatus! }).subscribe(response => {
      if (response) {
        this.carregarServicos();
        this.notificationService.success(`Serviço "${servico.nome}" ${statusTexto} com sucesso!`);
      } else {
        this.notificationService.error("Erro ao alterar status do serviço");
      }
    });
  }
}
