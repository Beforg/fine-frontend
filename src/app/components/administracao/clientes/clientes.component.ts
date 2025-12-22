import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../../services/perfil.service';
import { LoadingComponent } from '../../loading/loading.component';
import { ClienteInfo, FidelidadeDTO } from '../../../interfaces/entities.interface';
import { ModalFidelidadeComponent } from "./modal-fidelidade/modal-fidelidade.component";

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, MatIconModule, LoadingComponent, FormsModule, ModalFidelidadeComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  clientes: ClienteInfo[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  
  // Modal Fidelidade
  isFidelidadeModalOpen: boolean = false;
  selectedClienteNome: string = '';
  selectedFidelidadeCliente: any = null;
  
  // Paginação
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  Math = Math;

  constructor(private perfilService: PerfilService) {

  }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.isLoading = true;
    this.perfilService.getClientesInfo(this.currentPage).subscribe({
      next: (response) => {
        this.clientes = response.content.filter((item: ClienteInfo) => item.clienteInfo.nome.toLowerCase() !== 'administrador');
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.isLoading = false;
      }
    });
  }

  visualizarCliente(cliente: ClienteInfo): void {
    console.log('👁️ Visualizar cliente:', cliente);
    // TODO: Implementar modal ou navegação para detalhes
  }

  editarCliente(cliente: ClienteInfo): void {
    console.log('✏️ Editar cliente:', cliente);
    // TODO: Implementar modal de edição
  }

  toggleStatusCliente(cliente: ClienteInfo): void {
    const acao = cliente.ativo ? 'desativar' : 'ativar';
    console.log(`🔄 Tentando ${acao} cliente:`, cliente);
    
    // TODO: Implementar chamada ao serviço
    // this.clienteService.toggleStatus(cliente.id).subscribe(...)
    
    // Simulação
    cliente.ativo = !cliente.ativo;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadClientes();
  }

  getClienteByNome(nomeCliente: string): void {
    this.isLoading = true;
    this.perfilService.getClienteByNome(nomeCliente, this.currentPage).subscribe({
      next: (response) => {
        this.clientes = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar cliente por nome:', err);
        this.isLoading = false;
        this.loadClientes();
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.getClienteByNome(this.searchTerm.trim());
    } else {
      this.loadClientes();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadClientes();
  }

  openFidelidadeModal(cliente: ClienteInfo): void {
    this.selectedClienteNome = cliente.clienteInfo.nome;
    this.selectedFidelidadeCliente = cliente.clienteInfo.fidelidade;
    this.isFidelidadeModalOpen = true;
  }

  closeFidelidadeModal(): void {
    this.isFidelidadeModalOpen = false;
    this.selectedClienteNome = '';
    this.selectedFidelidadeCliente = null;
  }
}
