import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PerfilService } from '../../../services/perfil.service';
import { ClienteInfo } from '../../../interfaces/entities.interface';

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  dataCadastro: string;
  ativo: boolean;
}

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, MatIconModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  clientes: ClienteInfo[] = [];
  
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
    this.perfilService.getClientesInfo(this.currentPage).subscribe(response => {
      // response.content é um array de objetos com formato: {clienteInfo: {...}, ativo: boolean}
      this.clientes = response.content;
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;
    });
  }

  visualizarCliente(cliente: Cliente): void {
    console.log('👁️ Visualizar cliente:', cliente);
    // TODO: Implementar modal ou navegação para detalhes
  }

  editarCliente(cliente: Cliente): void {
    console.log('✏️ Editar cliente:', cliente);
    // TODO: Implementar modal de edição
  }

  toggleStatusCliente(cliente: Cliente): void {
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
}
