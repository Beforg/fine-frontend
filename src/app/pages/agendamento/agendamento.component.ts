import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AgendamentoService } from '../../services/agendamento.service';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { HeroSectionComponent } from "../../components/agendamento/hero-section/hero-section.component";
import { FormAgendamentoComponent } from "../../components/agendamento/form-agendamento/form-agendamento.component";
import { ProdutoService } from '../../services/produto.service';
import { ServicoService } from '../../services/servico.service';
import { AgendamentoRequest, Barbeiro, ItemProduto, ProdutoAgendamento, ServicoAgendamento } from '../../interfaces/entities.interface';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { BarbeiroService } from '../../services/barbeiro.service';



@Component({
  selector: 'app-agendamento',
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent,
    HeroSectionComponent,
    FormAgendamentoComponent,
    PrimaryButtonComponent
],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent implements OnInit {
  barbeiroId: string | null = null;
  barbeiro: Barbeiro | null = null;
  
  produtosDisponiveis: ProdutoAgendamento[] = [];
  servicosDisponiveis: ServicoAgendamento[] = [];

  //------- Informações do Agendamento

  servicosIds: number[] = [];
  produtos: ItemProduto[] = []
  selectedTime: string | null = null;
  selectedDate: string | null = null;

  //--------------
  isTimeSelected: boolean = false;
  isLoading: boolean = false;

  // Mock data baseado nos horários que você forneceu
  horariosDisponiveis: string[] = [];



  constructor(private route: ActivatedRoute, private agendamentoService: AgendamentoService, private servicoService: ServicoService, 
      private produtoService: ProdutoService, private barbeiroService: BarbeiroService) {
    this.barbeiroId = this.route.snapshot.paramMap.get('barbeiroId');
  }

  ngOnInit(): void {
    // Pegar o ID dos query parameters se não estiver nos route params
  
    this.route.queryParams.subscribe(params => {
      if (params['barbeiroId']) {
        this.barbeiroId = params['barbeiroId'];
      }
    });
    
    console.log('Barbeiro ID:', this.barbeiroId);
    this.getProdutosDisponiveis();
    this.getServicosDisponiveis();
    this.incrementarVisualizacao();
    this.loadBarbeiroData();
    window.scrollTo(0, 0);
  }

  loadBarbeiroData(){
    this.barbeiroService.getBarbeiroById(Number(this.barbeiroId)).subscribe({
      next: (barbeiro) => {
        this.barbeiro = barbeiro;
        console.log('Barbeiro carregado:', barbeiro);
      },
      error: (error) => {
        console.error('Erro ao carregar barbeiro:', error);
      }
    });
  }

  getProdutosIdsQuantidade(produtos: ItemProduto[]): void {
    this.produtos = produtos;
    console.log('Produtos e suas quantidades:', this.produtos);
  }

  getSelectedTime(time: string): void {
    this.isTimeSelected = true;
    this.selectedTime = time;
    console.log('Horário selecionado:', this.selectedTime);
  }

  onListarHorarios(dadosAgendamento: { data: string; servicosIds: number[], produtos: ItemProduto[] }): void {
    console.log('Recebido do form:', dadosAgendamento);

    const { data, servicosIds, produtos } = dadosAgendamento;
    this.selectedDate = data;
    this.produtos = produtos;
    this.servicosIds = servicosIds;

    // Chamar o serviço para buscar horários com os parâmetros
    this.agendamentoService.listarHorariosDisponiveis(Number(this.barbeiroId), data, servicosIds).subscribe({
      next: (horarios) => {
        this.horariosDisponiveis = horarios;
        console.log('Horários disponíveis atualizados:', horarios);
      },
      error: (error) => {
        console.error('Erro ao buscar horários:', error);
      }
    });
  }

  getProdutosDisponiveis(): void {
      this.produtoService.getProdutos().subscribe(produtos => {
        this.produtosDisponiveis = produtos.map(produto => ({
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 0
        }));
      });
    }
  
    getServicosDisponiveis(): void {
      this.servicoService.getServicos().subscribe(servicos => {
        this.servicosDisponiveis = servicos.map(servico => ({
          id: servico.id,
          nome: servico.nome,
          preco: servico.preco,
          duracaoMinutos: servico.duracaoMinutos
        }));
      })
    }

    submitAgendamento(): void {
      if (this.selectedTime) {

        this.isLoading = true;

        setTimeout(() => {
          console.log('Simulando delay de 2 segundos para o agendamento...');
        }, 2000);

        const dataHora = `${this.selectedDate}T${this.selectedTime}`;
        const novoAgendamento: AgendamentoRequest = {
          barbeiroId: Number(this.barbeiroId),
          servicoIds: this.servicosIds,
          dataHoraInicio: dataHora,
          produtos: this.produtos,
          observacoes: "Nenhuma observação",
        }
        console.log('Dados do agendamento:', novoAgendamento);
        this.agendamentoService.criarAgendamento(novoAgendamento).subscribe({
          next: (response) => {
            console.log('Agendamento confirmado para o horário:', this.selectedTime);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erro ao criar agendamento:', error);
            this.isLoading = false;
          }
        });
      } else {
        console.log('Nenhum horário selecionado.');
      }
    }

    cancelAgendamento(): void {

    }

    incrementarVisualizacao(): void {
      const storageKey = `barber-view-${this.barbeiroId}`;

    if (!sessionStorage.getItem(storageKey)) {
      this.barbeiroService.incrementarVisualizacao(Number(this.barbeiroId)).subscribe(() => {
        sessionStorage.setItem(storageKey, 'true');
      });
    }

    }
}
