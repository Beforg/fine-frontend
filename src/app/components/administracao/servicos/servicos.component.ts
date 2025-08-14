import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Servico } from '../../../interfaces/entities.interface';

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

  ngOnInit() {
    this.carregarServicos();
  }

  carregarServicos() {
    // Mock data - substituir pela chamada real da API
    this.servicos = [
      {
        id: 1,
        nome: 'Corte Masculino',
        descricao: 'Corte de cabelo masculino tradicional com acabamento perfeito',
        preco: 25.00,
        duracaoMinutos: 30
      },
      {
        id: 2,
        nome: 'Barba',
        descricao: 'Aparar e modelar barba com navalha e acabamento',
        preco: 15.00,
        duracaoMinutos: 20
      },
      {
        id: 3,
        nome: 'Corte + Barba',
        descricao: 'Pacote completo com corte de cabelo e barba',
        preco: 35.00,
        duracaoMinutos: 45
      },
      {
        id: 4,
        nome: 'Corte Infantil',
        descricao: 'Corte especial para crianças até 12 anos',
        preco: 20.00,
        duracaoMinutos: 25
      },
      {
        id: 5,
        nome: 'Sobrancelha',
        descricao: 'Design e limpeza de sobrancelhas masculinas',
        preco: 10.00,
        duracaoMinutos: 15
      },
      {
        id: 6,
        nome: 'Tratamento Capilar',
        descricao: 'Hidratação e tratamento para cabelos danificados',
        preco: 45.00,
        duracaoMinutos: 60
      }
    ];
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
        duracaoMinutos: 0
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
      alert('O nome do serviço é obrigatório');
      return;
    }

    if (!this.novoServico.descricao || !this.novoServico.descricao.trim()) {
      alert('A descrição do serviço é obrigatória');
      return;
    }

    if (!this.novoServico.preco || this.novoServico.preco <= 0) {
      alert('O preço deve ser maior que zero');
      return;
    }

    if (!this.novoServico.duracaoMinutos || this.novoServico.duracaoMinutos <= 0) {
      alert('A duração deve ser maior que zero');
      return;
    }

    if (this.servicoSelecionado) {
      // Editar serviço existente
      const index = this.servicos.findIndex(s => s.id === this.servicoSelecionado?.id);
      if (index !== -1) {
        this.servicos[index] = {
          ...this.servicoSelecionado,
          ...this.novoServico
        } as Servico;
      }
    } else {
      // Adicionar novo serviço
      const novoId = Math.max(...this.servicos.map(s => s.id || 0)) + 1;
      const servico: Servico = {
        id: novoId,
        nome: this.novoServico.nome!,
        descricao: this.novoServico.descricao!,
        preco: this.novoServico.preco!,
        duracaoMinutos: this.novoServico.duracaoMinutos!
      };
      this.servicos.push(servico);
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
}
