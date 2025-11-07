import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AgendamentoRequest, Barbeiro, FidelidadeDTO, ItemProduto, ProdutoAgendamento, ServicoAgendamento } from '../../interfaces/entities.interface';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { BarbeiroService } from '../../services/barbeiro.service';
import { NotificationService } from '../../services/notification.service';
import { PerfilService } from '../../services/perfil.service';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from "../../components/agendamento/modal/modal.component";



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
    PrimaryButtonComponent,
    ModalComponent
],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent implements OnInit {
  barbeiroId: string | null = null;
  barbeiro: Barbeiro | null = null

  fidelidadeCliente!: FidelidadeDTO | null;
  fidelidadeAplicada: boolean = false; // Indica se a fidelidade foi aplicada ao serviço de corte
  
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
  agendamentoFinalizado: boolean = false;
  modalConfirmarVisible: boolean = false;

  // Mock data baseado nos horários que você forneceu
  horariosDisponiveis: string[] = [];



  constructor(
    private route: ActivatedRoute, 
    private agendamentoService: AgendamentoService, 
    private servicoService: ServicoService, 
    private produtoService: ProdutoService, 
    private barbeiroService: BarbeiroService, 
    private notificationService: NotificationService,
    private perfilService: PerfilService,
    private authService: AuthService,
    private router: Router) { 
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
    if (this.isLoggedIn()) {
      this.getFidelidadeCliente();
    }
    window.scrollTo(0, 0);

  }

  handleAbrirModalConfirmar(): void {
    if (!this.isLoggedIn()) {
      this.notificationService.info("Por favor, faça login para agendar um horário.");
      this.router.navigate(['/login']);
      return;
    }

    this.modalConfirmarVisible = true;
  }

  handleConfirmarModal(): void {
    this.submitAgendamento();
    this.modalConfirmarVisible = false;
  }
  
  handleCancelarModal(): void {
    this.modalConfirmarVisible = false;
  }

  handleDescontoAplicadoChang(aplicado: boolean): void {
    this.fidelidadeAplicada = aplicado;
  }

  verificaCorteGratis(): boolean {
    return this.fidelidadeCliente?.sequencia! >= 5 
    && this.fidelidadeCliente?.fidelidadeAplicada == false
    && this.fidelidadeAplicada;
  }

  getFidelidadeCliente(): void {
    if (!this.authService.isAuthenticated()) {
      this.fidelidadeCliente = null;
    } else {
    this.perfilService.getUserInfos().subscribe({
      next: (userInfo) => {
        this.fidelidadeCliente = userInfo.fidelidade;
        console.log('Fidelidade do cliente carregada:', this.fidelidadeCliente);
      
      },
      error: (error) => {
        console.error('Erro ao carregar fidelidade do cliente:', error);
        this.fidelidadeCliente = null;
      }
    })
  }
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
        this.produtosDisponiveis = produtos.filter(produto => produto.ativo === true && produto.estoque > 0).map(produto => ({
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 0,
          estoque: produto.estoque
        }));
      });
    }
  
    getServicosDisponiveis(): void {
      this.servicoService.getServicos().subscribe(servicos => {
        this.servicosDisponiveis = servicos
          .filter(servico => servico.ativo === true) // Filtra apenas serviços ativos
          .map(servico => ({
            id: servico.id,
            nome: servico.nome,
            preco: servico.preco,
            duracaoMinutos: servico.duracaoMinutos
          }));
      })
    }

    isLoggedIn(): boolean {
      return this.authService.isAuthenticated();
    }

    submitAgendamento(): void {
      console.log(this.verificaCorteGratis());

      if (this.selectedTime) {
        this.agendamentoFinalizado = true;
        this.isLoading = true;

        const dataHora = `${this.selectedDate}T${this.selectedTime}`;
        const novoAgendamento: AgendamentoRequest = {
          barbeiroId: Number(this.barbeiroId),
          servicoIds: this.servicosIds,
          dataHoraInicio: dataHora,
          produtos: this.produtos,
          observacoes: "Nenhuma observação",
          foiGratis: this.verificaCorteGratis()
        }
        console.log('Dados do agendamento:', novoAgendamento);
        this.agendamentoService.criarAgendamento(novoAgendamento).subscribe({
          next: (response) => {
            console.log('Agendamento confirmado para o horário:', this.selectedTime);
            this.isLoading = false;
            this.notificationService.success("Agendamento criado com sucesso! no dia " + this.selectedDate + " às " + this.selectedTime);
            // refresh page after 3 seconds
            setTimeout(() => {
              this.router.navigate([`/perfil`], { queryParams: { tab: 'g' } });
            }, 3000);
          },
          error: (error) => {
            console.error('Erro ao criar agendamento:', error);
            this.isLoading = false;
            this.agendamentoFinalizado = false;
            this.notificationService.error("Erro ao criar agendamento. Por favor, tente novamente mais tarde.");
          }
        });
      } else {
        this.notificationService.warning("Por favor, selecione um horário antes de confirmar o agendamento.");
      }
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
