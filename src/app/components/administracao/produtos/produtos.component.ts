import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../services/produto.service';
import { NotificationService } from '../../../services/notification.service';
import { ImageService } from '../../../services/image.service';
import { LoadingComponent } from '../../loading/loading.component';
import {
  CadastroProduto,
  Produto,
} from '../../../interfaces/entities.interface';

// Interface para o produto

@Component({
  selector: 'app-produtos-gerenciamento',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    LoadingComponent,
  ],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss',
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  isLoading: boolean = true;

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
  ) {}

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
      urlFoto: '',
      ativo: true,
    };
  }

  carregarProdutos(): void {
    this.isLoading = true;
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.isLoading = false;
      },
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
      this.previewImageUrl = produto.urlFoto || null;
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

  editarProduto(produto: Produto): void {
    console.log('Editando produto:', produto);
    this.abrirModal(produto);
  }

  removerProduto(produtoId: number): void {
    const produto = this.produtos.find((p) => p.id === produtoId);
    if (!produto) return;

    const confirmacao = confirm(
      `Tem certeza que deseja remover o produto "${produto.nome}"?`
    );
    if (confirmacao) {
      this.produtoService.excluirProduto(produtoId).subscribe({
        next: (response) => {
          this.notificationService.success(`Produto removido com sucesso!`);
          this.carregarProdutos();
        },
        error: (err) => {
          console.error('Erro ao remover produto:', err);
          this.notificationService.error(
            err.error?.message || 'Erro ao remover produto'
          );
        },
      });

      // Remover localmente para resposta mais rápida

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
        this.imageService
          .uploadProdutoPhoto(this.selectedImageFile, this.currentProduto.nome)
          .subscribe({
            next: (url) => {
              this.currentProduto.urlFoto = url;
              console.log('✅ Imagem do produto atualizada:', url);

              // Atualizar produto após upload
              this.atualizarProduto();
            },
            error: (error) => {
              console.error('❌ Erro no upload da imagem:', error);
              this.notificationService.error('Erro ao fazer upload da imagem');
              this.fecharModal();
            },
          });
      } else {
        // Atualizar sem nova imagem
        this.atualizarProduto();
      }
    } else {
      // Criar novo produto
      if (this.selectedImageFile) {
        this.imageService
          .uploadProdutoPhoto(this.selectedImageFile, this.currentProduto.nome)
          .subscribe({
            next: (url) => {
              console.log('✅ Imagem do produto salva:', url);

              // Atualizar produto com a URL da imagem

              const novoProduto: CadastroProduto = {
                nome: this.currentProduto.nome,
                preco: this.currentProduto.preco,
                estoque: this.currentProduto.estoque,
                descricao: this.currentProduto.descricao,
                urlFoto: url || '/fine-logo.png',
              };
              this.cadastrarProduto(novoProduto);
            },
            error: (error) => {
              console.error('❌ Erro no upload da imagem:', error);
              this.notificationService.error(
                'Produto criado, mas erro ao fazer upload da imagem'
              );
              this.fecharModal();
            },
          });
      } else {
        const novoProduto: CadastroProduto = {
          nome: this.currentProduto.nome,
          preco: this.currentProduto.preco,
          estoque: this.currentProduto.estoque,
          descricao: this.currentProduto.descricao,
          urlFoto: '/fine-logo.png',
        };
        this.cadastrarProduto(novoProduto);
      }

      const novoProduto: CadastroProduto = {
        nome: this.currentProduto.nome,
        preco: this.currentProduto.preco,
        estoque: this.currentProduto.estoque,
        descricao: this.currentProduto.descricao,
        urlFoto: this.currentProduto.urlFoto || '/fine-logo.png',
      };
    }
  }

  private cadastrarProduto(novoProduto: CadastroProduto): void {
    this.produtoService.cadastrarProduto(novoProduto).subscribe((response) => {
      if (response.httpStatus === 'CREATED') {
        this.carregarProdutos();
        this.notificationService.success(
          `Produto "${this.currentProduto.nome}" cadastrado com sucesso!`
        );
        this.fecharModal();
      } else {
        this.notificationService.error(
          response.message || 'Erro ao cadastrar produto'
        );
        this.fecharModal();
      }
    });
  }

  private atualizarProduto(): void {
    this.produtoService
      .editarProduto(this.currentProduto)
      .subscribe((response) => {
        if (response) {
          this.carregarProdutos();
          this.notificationService.success(
            `Produto "${this.currentProduto.nome}" editado com sucesso!`
          );
        } else {
          this.notificationService.error(
            response.mensagem || 'Erro ao editar produto'
          );
        }
        this.fecharModal();
      });
  }

  // =============================================
  // MÉTODOS AUXILIARES
  // =============================================
  toggleStatus(produto: Produto): void {
    const novoStatus = !produto.ativo;
    const statusTexto = novoStatus ? 'ativado' : 'desativado';

    this.produtoService
      .editarProduto({ ...produto, ativo: novoStatus })
      .subscribe((response) => {
        if (response) {
          this.carregarProdutos();
          this.notificationService.success(
            `Produto "${produto.nome}" ${statusTexto} com sucesso!`
          );
        } else {
          this.notificationService.error(
            response.mensagem || 'Erro ao alterar status do produto'
          );
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
    this.currentProduto.urlFoto = '';

    // Limpar input
    const imageInput = document.getElementById(
      'imageInput'
    ) as HTMLInputElement;
    if (imageInput) imageInput.value = '';
  }

  // Método para abrir seletor de arquivo
  abrirSeletorImagem(): void {
    const imageInput = document.getElementById(
      'imageInput'
    ) as HTMLInputElement;
    if (imageInput) imageInput.click();
  }
}
