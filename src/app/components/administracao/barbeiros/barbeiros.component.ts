import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Barbeiro } from '../../../interfaces/entities.interface';

@Component({
  selector: 'app-barbeiros-gerenciamento',
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './barbeiros.component.html',
  styleUrl: './barbeiros.component.scss'
})
export class BarbeirosComponent implements OnInit {
  barbeiros: Barbeiro[] = [];
  // Modal/Formulário
  showModal: boolean = false;
  isEditing: boolean = false;
  currentBarbeiro: Barbeiro = this.getEmptyBarbeiro();

  ngOnInit(): void {
    this.carregarBarbeiros();
  }

  getEmptyBarbeiro(): Barbeiro {
    return {
      barbeiroId: 0,
      nome: '',
      telefone: '',
      visualizacoes: 0,
      corteRealizados: 0,
      urlFoto: '',
      urlBackground: ''
    };
  }

  carregarBarbeiros(): void {
    // Mock data - substituir pela chamada ao serviço
    this.barbeiros = [
      {
        barbeiroId: 1,
        nome: 'João Silva',
        telefone: '(11) 99999-9999',
        visualizacoes: 1250,
        corteRealizados: 340,
        urlFoto: 'assets/tmp/barbeiro1.png',
        urlBackground: 'assets/tmp/bgBarbeiro1.png'
      },
      {
        barbeiroId: 2,
        nome: 'Pedro Santos',
        telefone: '(11) 88888-8888',
        visualizacoes: 890,
        corteRealizados: 215,
        urlFoto: '',
        urlBackground: ''
      },
      {
        barbeiroId: 3,
        nome: 'Carlos Oliveira',
        telefone: '(11) 77777-7777',
        visualizacoes: 2100,
        corteRealizados: 567,
        urlFoto: '',
        urlBackground: ''
      }
    ];
  }

  // =============================================
  // MODAL E FORMULÁRIO
  // =============================================
  abrirModal(barbeiro?: Barbeiro): void {
    this.showModal = true;
    
    if (barbeiro) {
      this.isEditing = true;
      this.currentBarbeiro = { ...barbeiro }; // Copia para não alterar o original
    } else {
      this.isEditing = false;
      this.currentBarbeiro = this.getEmptyBarbeiro();
    }
  }

  fecharModal(): void {
    this.showModal = false;
    this.currentBarbeiro = this.getEmptyBarbeiro();
    this.isEditing = false;
  }

  salvarBarbeiro(): void {
    // Validações básicas
    if (!this.currentBarbeiro.nome.trim()) {
      alert('Nome do barbeiro é obrigatório!');
      return;
    }

    if (!this.currentBarbeiro.telefone.trim()) {
      alert('Telefone é obrigatório!');
      return;
    }

    if (this.isEditing) {
      // Atualizar barbeiro existente
      const index = this.barbeiros.findIndex(b => b.barbeiroId === this.currentBarbeiro.barbeiroId);
      if (index !== -1) {
        this.barbeiros[index] = { ...this.currentBarbeiro };
        console.log('Barbeiro atualizado:', this.currentBarbeiro);
      }
    } else {
      // Adicionar novo barbeiro
      const novoId = Math.max(...this.barbeiros.map(b => b.barbeiroId)) + 1;
      const novoBarbeiro = { ...this.currentBarbeiro, barbeiroId: novoId };
      this.barbeiros.push(novoBarbeiro);
      console.log('Novo barbeiro adicionado:', novoBarbeiro);
    }

    this.fecharModal();
    // Aqui você faria a chamada para o serviço salvar no backend
  }

  editarBarbeiro(barbeiro: Barbeiro): void {
    console.log('Editando barbeiro:', barbeiro);
    this.abrirModal(barbeiro);
  }

  removerBarbeiro(barbeiroId: number): void {
    const barbeiro = this.barbeiros.find(b => b.barbeiroId === barbeiroId);
    if (!barbeiro) return;

    const confirmacao = confirm(`Tem certeza que deseja remover o barbeiro "${barbeiro.nome}"?`);
    if (confirmacao) {
      this.barbeiros = this.barbeiros.filter(b => b.barbeiroId !== barbeiroId);
      console.log('Barbeiro removido:', barbeiroId);
      // Implementar chamada ao serviço para remover do backend
    }
  }

  adicionarBarbeiro(): void {
    console.log('Adicionando novo barbeiro');
    this.abrirModal();
  }
}
