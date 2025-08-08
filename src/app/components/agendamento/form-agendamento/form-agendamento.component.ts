import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ItemProduto, ProdutoAgendamento, ServicoAgendamento } from '../../../interfaces/entities.interface';
import { ServicoService } from '../../../services/servico.service';
import { ProdutoService } from '../../../services/produto.service';
import { HorariosComponent } from '../horarios/horarios.component';

@Component({
  selector: 'app-form-agendamento',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule, 
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    HorariosComponent
  ],
  templateUrl: './form-agendamento.component.html',
  styleUrl: './form-agendamento.component.scss'
})
export class FormAgendamentoComponent implements OnInit {
  
  // Serviços disponíveis
  @Input() servicosDisponiveis: ServicoAgendamento[] = [];
  selectedDate: string | null = null;

  @Input() horariosDisponiveis: string[] = [];
  // Produtos disponíveis
  @Input() produtosDisponiveis: ProdutoAgendamento[] = []; 
  @Output() listarHorarios = new EventEmitter<{
    data: string;
    servicosIds: number[];
    produtos: ItemProduto[];
  }>();
  @Output() timeSelected = new EventEmitter<string>();
  @Output() produtosIdQuantidade = new EventEmitter<ItemProduto[]>();

  // Itens selecionados
  servicosSelecionados: ServicoAgendamento[] = [];
  produtosSelecionados: ProdutoAgendamento[] = [];

  
  constructor() { }

  handleListarHorarios(): void {
    if (this.selectedDate && this.servicosSelecionados.length > 0) {
      const servicosIds = this.servicosSelecionados.map(servico => servico.id);
      const produtos: ItemProduto[] = this.produtosSelecionados.map(produto => ({
        produtoId: produto.id,
        quantidade: produto.quantidade
      }));

      this.listarHorarios.emit({
        data: this.selectedDate,
        servicosIds: servicosIds,
        produtos: produtos
      });
      
      console.log('Emitindo horários com:', {
        data: this.selectedDate,
        servicosIds: servicosIds,
        produtos: produtos
      });
    } else {
      console.log('Data ou serviços não selecionados');
    }
  }

  onTimeSelected(time: string): void {
    this.timeSelected.emit(time);
    
  }

  handleOnProdutoSelecionado(): void {
    const produtos: ItemProduto[] = this.produtosSelecionados.map(produto => ({
        produtoId: produto.id,
        quantidade: produto.quantidade
      }));
    this.produtosIdQuantidade.emit(produtos);
  }

  ngOnInit(): void {
    // verificar futuramente se está salvo em cache já para aproveitar.
    // this.getProdutosDisponiveis();
    // this.getServicosDisponiveis();
  }


  // Métodos para serviços
  addService(servico: ServicoAgendamento): void {
    // Verificar se o serviço já foi selecionado
    const jaExiste = this.servicosSelecionados.find(s => s.id === servico.id);
    if (!jaExiste) {
      this.servicosSelecionados.push({ ...servico });
      this.calculateTotal();
      this.handleListarHorarios();
    }
  }

  removeService(index: number): void {
    this.servicosSelecionados.splice(index, 1);
    this.calculateTotal();
    if (this.servicosSelecionados.length > 0) {
      this.handleListarHorarios();
    }
  }

  // Métodos para produtos
  addProduct(produto: ProdutoAgendamento): void {
    // Verificar se o produto já foi selecionado
    const jaExiste = this.produtosSelecionados.find(p => p.id === produto.id);
    if (!jaExiste) {
      this.produtosSelecionados.push({ ...produto, quantidade: 1 });
      this.calculateTotal();
      this.handleOnProdutoSelecionado();
    }
  }

  removeProduct(index: number): void {
    this.produtosSelecionados.splice(index, 1);
    this.calculateTotal();
    this.handleOnProdutoSelecionado();
  }

  increaseQuantity(type: string, index: number): void {
    if (type === 'produto') {
      this.produtosSelecionados[index].quantidade++;
      this.calculateTotal();
      this.handleOnProdutoSelecionado();
    }
  }

  decreaseQuantity(type: string, index: number): void {
    if (type === 'produto') {
      if (this.produtosSelecionados[index].quantidade > 1) {
        this.produtosSelecionados[index].quantidade--;
        this.calculateTotal();
        this.handleOnProdutoSelecionado();
      }
    }
  }

  // Calcular total
  calculateTotal(): void {
    const totalServicos = this.servicosSelecionados.reduce((sum, servico) => sum + servico.preco, 0);
    const totalProdutos = this.produtosSelecionados.reduce((sum, produto) => sum + (produto.preco * produto.quantidade), 0);
    
    // Aqui você pode emitir o total para o componente pai ou atualizar uma propriedade
    console.log('Total Serviços:', totalServicos);
    console.log('Total Produtos:', totalProdutos);
    console.log('Total Geral:', totalServicos + totalProdutos);
  }

  //Liberar o input de serviços e produtos
  onDateSelected(selectedDate: string): void {
    this.selectedDate = selectedDate;
    console.log('Data selecionada:', this.selectedDate);
    
    if (this.selectedDate && this.selectedDate.trim() !== '') {
      console.log('Data válida! Liberando campos de serviços e produtos...');
      this.enableServiceAndProductInputs();
      
      // Se já tem serviços selecionados, buscar horários
      if (this.servicosSelecionados.length > 0) {
        this.handleListarHorarios();
      }
    } else {
      console.log('Data não selecionada. Campos bloqueados.');
      this.disableServiceAndProductInputs();
    }
  }

  // Verificar se a data foi selecionada para liberar outros campos
  get isDateSelected(): boolean {
    return !!this.selectedDate && this.selectedDate.trim() !== '';
  }

  // Função para habilitar campos de serviços e produtos
  private enableServiceAndProductInputs(): void {
    // Aqui você pode adicionar lógica para habilitar campos
    console.log('Campos de serviços e produtos habilitados');
  }

  // Função para desabilitar campos de serviços e produtos
  private disableServiceAndProductInputs(): void {
    this.servicosSelecionados = [];
    this.produtosSelecionados = [];
    console.log('Campos de serviços e produtos desabilitados');
  }

  // Getter para o total
  get totalGeral(): number {
    const totalServicos = this.servicosSelecionados.reduce((sum, servico) => sum + servico.preco, 0);
    const totalProdutos = this.produtosSelecionados.reduce((sum, produto) => sum + (produto.preco * produto.quantidade), 0);
    return totalServicos + totalProdutos;
  }
}
