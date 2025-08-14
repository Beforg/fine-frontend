import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

// Interface para o produto
interface Produto {
  id: number;
  nome: string;
  estoque: number;
  preco: number;
  descricao?: string;
  ativo: boolean;
}

@Component({
  selector: 'app-produtos-gerenciamento',
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  
  // Modal/Formulário
  showModal: boolean = false;
  isEditing: boolean = false;
  currentProduto: Produto = this.getEmptyProduto();

  ngOnInit(): void {
    this.carregarProdutos();
  }

  getEmptyProduto(): Produto {
    return {
      id: 0,
      nome: '',
      estoque: 0,
      preco: 0,
      descricao: '',
      ativo: true
    };
  }

  carregarProdutos(): void {
    // Mock data - substituir pela chamada ao serviço
    this.produtos = [
      {
        id: 1,
        nome: 'Shampoo Premium',
        estoque: 25,
        preco: 35.90,
        descricao: 'Shampoo para cabelos oleosos',
        ativo: true
      },
      {
        id: 2,
        nome: 'Cera Modeladora',
        estoque: 5,
        preco: 22.50,
        descricao: 'Cera para fixação de cabelo',
        ativo: true
      },
      {
        id: 3,
        nome: 'Gel Fixador',
        estoque: 30,
        preco: 18.90,
        descricao: 'Gel para fixação forte',
        ativo: true
      },
      {
        id: 4,
        nome: 'Produto Descontinuado',
        estoque: 0,
        preco: 15.00,
        descricao: 'Produto fora de linha',
        ativo: false
      }
    ];
  }

  // =============================================
  // MODAL E FORMULÁRIO
  // =============================================
  abrirModal(produto?: Produto): void {
    this.showModal = true;
    
    if (produto) {
      this.isEditing = true;
      this.currentProduto = { ...produto }; // Copia para não alterar o original
    } else {
      this.isEditing = false;
      this.currentProduto = this.getEmptyProduto();
    }
  }

  fecharModal(): void {
    this.showModal = false;
    this.currentProduto = this.getEmptyProduto();
    this.isEditing = false;
  }

  salvarProduto(): void {
    // Validações básicas
    if (!this.currentProduto.nome.trim()) {
      alert('Nome do produto é obrigatório!');
      return;
    }

    if (this.currentProduto.preco <= 0) {
      alert('Preço deve ser maior que zero!');
      return;
    }

    if (this.currentProduto.estoque < 0) {
      alert('Estoque não pode ser negativo!');
      return;
    }

    if (this.isEditing) {
      // Atualizar produto existente
      const index = this.produtos.findIndex(p => p.id === this.currentProduto.id);
      if (index !== -1) {
        this.produtos[index] = { ...this.currentProduto };
        console.log('Produto atualizado:', this.currentProduto);
      }
    } else {
      // Adicionar novo produto
      const novoId = Math.max(...this.produtos.map(p => p.id)) + 1;
      const novoProduto = { ...this.currentProduto, id: novoId };
      this.produtos.push(novoProduto);
      console.log('Novo produto adicionado:', novoProduto);
    }

    this.fecharModal();
    // Aqui você faria a chamada para o serviço salvar no backend
  }

  editarProduto(produto: Produto): void {
    console.log('Editando produto:', produto);
    this.abrirModal(produto);
  }

  removerProduto(produtoId: number): void {
    const produto = this.produtos.find(p => p.id === produtoId);
    if (!produto) return;

    const confirmacao = confirm(`Tem certeza que deseja remover o produto "${produto.nome}"?`);
    if (confirmacao) {
      this.produtos = this.produtos.filter(p => p.id !== produtoId);
      console.log('Produto removido:', produtoId);
      // Implementar chamada ao serviço para remover do backend
    }
  }

  adicionarProduto(): void {
    console.log('Adicionando novo produto');
    this.abrirModal();
  }

  // =============================================
  // MÉTODOS AUXILIARES
  // =============================================
  toggleStatus(produto: Produto): void {
    produto.ativo = !produto.ativo;
    console.log(`Status do produto ${produto.nome} alterado para: ${produto.ativo ? 'Ativo' : 'Inativo'}`);
    // Implementar chamada ao serviço para atualizar no backend
  }
}
