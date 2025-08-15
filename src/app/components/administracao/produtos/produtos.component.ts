import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../services/produto.service';
import { NotificationService } from '../../../services/notification.service';
import { ImageService } from '../../../services/image.service';
import { CadastroProduto, Produto } from '../../../interfaces/entities.interface';

// Interface para o produto

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
  
  // Upload de imagem
  selectedImageFile: File | null = null;
  previewImageUrl: string | null = null;

  constructor(
    private produtoService: ProdutoService,
    private notificationService: NotificationService,
    private imageService: ImageService
  ) {
    
  }

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
      urlImagem: '',
      ativo: true
    };
  }

  carregarProdutos(): void {
    // Mock data - substituir pela chamada ao serviço
    this.produtoService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;
    });
  }

  // =============================================
  // MODAL E FORMULÁRIO
  // =============================================
  abrirModal(produto?: Produto): void {
    this.showModal = true;
    
    if (produto) {
      this.isEditing = true;
      this.currentProduto = { ...produto }; // Copia para não alterar o original
      // Definir preview com a URL existente
      this.previewImageUrl = produto.urlImagem || null;
    } else {
      this.isEditing = false;
      this.currentProduto = this.getEmptyProduto();
      // Limpar preview
      this.previewImageUrl = null;
    }
    
    // Limpar arquivo selecionado
    this.selectedImageFile = null;
  }

  fecharModal(): void {
    this.showModal = false;
    this.currentProduto = this.getEmptyProduto();
    this.isEditing = false;
    // Limpar uploads e preview
    this.selectedImageFile = null;
    this.previewImageUrl = null;
  }

  // salvarProduto(): void {
  //   // Validações básicas
  //   if (!this.currentProduto.nome.trim()) {
  //     alert('Nome do produto é obrigatório!');
  //     return;
  //   }

  //   if (this.currentProduto.preco <= 0) {
  //     alert('Preço deve ser maior que zero!');
  //     return;
  //   }

  //   if (this.currentProduto.estoque < 0) {
  //     alert('Estoque não pode ser negativo!');
  //     return;
  //   }

  //   if (this.isEditing) {
  //     // Atualizar produto existente
  //     const index = this.produtos.findIndex(p => p.id === this.currentProduto.id);
  //     if (index !== -1) {
  //       this.produtos[index] = { ...this.currentProduto };
  //       console.log('Produto atualizado:', this.currentProduto);
  //     }
  //   } else {
  //     // Adicionar novo produto
  //     const novoId = Math.max(...this.produtos.map(p => p.id)) + 1;
  //     const novoProduto = { ...this.currentProduto, id: novoId };
  //     this.produtos.push(novoProduto);
  //     console.log('Novo produto adicionado:', novoProduto);
  //   }

  //   this.fecharModal();
  //   // Aqui você faria a chamada para o serviço salvar no backend
  // }

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

  salvarProduto(): void {
    if (this.isEditing) {
      // Upload da imagem se foi selecionada
      if (this.selectedImageFile) {
        const imageUrl = this.imageService.uploadProdutoPhoto(this.selectedImageFile, this.currentProduto.id);
        this.currentProduto.urlImagem = imageUrl;
      }

      this.produtoService.editarProduto(this.currentProduto).subscribe(response => {
        if (response) {
          this.carregarProdutos();
          this.notificationService.success(`Produto "${this.currentProduto.nome}" editado com sucesso!`);
        } else {
          this.notificationService.error(response.mensagem || 'Erro ao editar produto');
        }
      });
    } else {
      const novoProduto: CadastroProduto = {
        nome: this.currentProduto.nome,
        preco: this.currentProduto.preco,
        estoque: this.currentProduto.estoque,
        descricao: this.currentProduto.descricao,
        urlImagem: this.currentProduto.urlImagem || '/fine-logo.png'
      }
      this.produtoService.cadastrarProduto(novoProduto).subscribe(response => {
        if (response.httpStatus === "CREATED") {
          this.carregarProdutos();
          
          // Fazer upload da imagem após criar o produto
          if (this.selectedImageFile) {
            // Usar timestamp como ID temporário para o nome do arquivo
            const tempId = Date.now();
            const imageUrl = this.imageService.uploadProdutoPhoto(this.selectedImageFile, tempId);
            console.log(`Imagem salva para produto: ${imageUrl}`);
          }
          
          this.notificationService.success(`Produto "${this.currentProduto.nome}" cadastrado com sucesso!`);
        } else {
          this.notificationService.error(response.message || 'Erro ao cadastrar produto');
        }
      });
    }

    this.fecharModal();
  }

  // =============================================
  // MÉTODOS AUXILIARES
  // =============================================
  toggleStatus(produto: Produto): void {
    const novoStatus = !produto.ativo;
    const statusTexto = novoStatus ? 'ativado' : 'desativado';
    
    this.produtoService.editarProduto({ ...produto, ativo: novoStatus }).subscribe(response => {
      if (response) {
        this.carregarProdutos();
        this.notificationService.success(`Produto "${produto.nome}" ${statusTexto} com sucesso!`);
      } else {
        this.notificationService.error(response.mensagem || 'Erro ao alterar status do produto');
      }
    });
  }

  // =============================================
  // MÉTODOS DE UPLOAD DE IMAGEM
  // =============================================
  
  // Método para selecionar imagem do produto
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validation = this.imageService.validateImageFile(file, 5);
      if (!validation.valid) {
        this.notificationService.validationError(validation.error!);
        return;
      }

      this.selectedImageFile = file;
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para remover imagem
  removerImagem(): void {
    this.selectedImageFile = null;
    this.previewImageUrl = null;
    this.currentProduto.urlImagem = '';
    
    // Limpar input
    const imageInput = document.getElementById('imageInput') as HTMLInputElement;
    if (imageInput) imageInput.value = '';
  }

  // Método para abrir seletor de arquivo
  abrirSeletorImagem(): void {
    const imageInput = document.getElementById('imageInput') as HTMLInputElement;
    if (imageInput) imageInput.click();
  }
}
