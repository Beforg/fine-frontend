import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FidelidadeDTO, ItemProduto, ProdutoAgendamento, ServicoAgendamento } from '../../../interfaces/entities.interface';
import { HorariosComponent } from '../horarios/horarios.component';
import { ModalComponent } from "../modal/modal.component";

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
    MatInputModule,
    HorariosComponent
],
  templateUrl: './form-agendamento.component.html',
  styleUrl: './form-agendamento.component.scss'
})
export class FormAgendamentoComponent implements OnInit {
  
  @Input() isLoggedIn: boolean = false;
  // Fidelidade dados
  @Input() fidelidadeCliente: FidelidadeDTO | null = null;
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
    observacoes?: string;
  }>();
  @Output() timeSelected = new EventEmitter<string>();
  @Output() produtosIdQuantidade = new EventEmitter<ItemProduto[]>();

  // Itens selecionados
  servicosSelecionados: ServicoAgendamento[] = [];
  produtosSelecionados: ProdutoAgendamento[] = [];

  // Observação do agendamento
  observacao: string = '';

  corteGratis!: boolean;
  // aplicar a fidelidade
  descontoAplicado: boolean = false;
  @Output() descontoAplicadoChange = new EventEmitter<boolean>();

  idServicoAplicado: number | null = null;


  
  constructor() { }

    ngOnInit(): void {
    if (this.isLoggedIn) {
      this.validateCorteGratis();
    }
  }

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
        produtos: produtos,
        observacoes: this.observacao
      });
      
    }
  }
  
  calcularTempoDeServico(): number {
    return this.servicosSelecionados.reduce((total, servico) => total + servico.duracaoMinutos, 0);
  }

  validateCorteGratis(): boolean {

    if (!this.isLoggedIn) {
      this.corteGratis = false;
      return this.corteGratis;
    } else if (this.fidelidadeCliente == null) {
      this.corteGratis = false;
      return this.corteGratis;
    }

    if (this.fidelidadeCliente 
      && this.fidelidadeCliente.sequencia >= 5 
      && this.fidelidadeCliente.validade >= new Date().toISOString().split('T')[0]
      && !this.fidelidadeCliente.fidelidadeAplicada) {
      this.corteGratis = true;
      console.log('Corte grátis disponível');
    } else {
      this.corteGratis = false;
    }
    return this.corteGratis;
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




  // Métodos para serviços
  addService(servico: ServicoAgendamento): void {
    // Verificar se o serviço já foi selecionado
    const jaExiste = this.servicosSelecionados.find(s => s.id === servico.id);
    
    if (!jaExiste) {
      const servicoSelecionado: ServicoAgendamento = { ...servico };
      this.descontoCorteGratis(servicoSelecionado); 
      this.servicosSelecionados.push(servicoSelecionado);
      this.calculateTotal();
      this.handleListarHorarios();
    }
  }

  descontoCorteGratis(servico: ServicoAgendamento): void {
    if (this.corteGratis 
      && (servico.nome.toLowerCase().includes('cabelo') || servico.nome.toLowerCase().includes('corte')) &&
      !this.descontoAplicado) {
      servico.preco -= 35; 
      servico.nome = servico.nome + ' (Corte Grátis)';
      this.idServicoAplicado = servico.id;
      this.descontoAplicado = true;
      this.descontoAplicadoChange.emit(this.descontoAplicado);
      console.log('Desconto aplicado ao serviço de cabelo grátis');
    }
  }
  removeService(index: number, id: number): void {
    this.servicosSelecionados.splice(index, 1); 
    if (this.idServicoAplicado != null && id === this.idServicoAplicado) {
      this.descontoAplicado = false;
      this.descontoAplicadoChange.emit(this.descontoAplicado);
      this.idServicoAplicado = null;
      console.log('Desconto removido ao retirar o serviço de cabelo grátis');
    }
    this.calculateTotal();
    if (this.servicosSelecionados.length > 0) {
      this.handleListarHorarios();
    } else {
      this.horariosDisponiveis = [];
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
      if (this.produtosSelecionados[index].quantidade < this.produtosSelecionados[index].estoque) {
        this.produtosSelecionados[index].quantidade++;
      }
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
    this.servicosSelecionados.reduce((sum, servico) => sum + servico.preco, 0);
    this.produtosSelecionados.reduce((sum, produto) => sum + (produto.preco * produto.quantidade), 0);
    
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
