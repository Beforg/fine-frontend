export interface Barbeiro {
    barbeiroId: number;
    nome: string;
    telefone: string;
    visualizacoes: number;
    corteRealizados: number;
    urlFoto: string;
    urlBackground: string;
}

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    urlImagem: string;
    // estoque
}

export interface ProdutoAgendamento {
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
}

export interface ServicoAgendamento {
    id: number;
    nome: string;
    preco: number;
    duracaoMinutos: number;
}

export interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracaoMinutos: number;
}

export interface UserInfo {
    nome: string;
    telefone: string;
    dataCadastro: string;
}

export interface ItemProduto {
  produtoId: number;
  quantidade: number;
}

export interface HorarioDisponivel {
  dataHora: string; // Ou 'Date', dependendo de como você vai usar
  disponivel: boolean;
}

export interface AgendamentoRequest {
  barbeiroId: number;
  servicoIds: number[];
  dataHoraInicio: string; // Ou 'Date', dependendo de como você vai usar
  produtos?: ItemProduto[]; // O '?' indica que é opcional
  observacoes: string;
}

export interface Agendamento {
  id: number;
  nomeCliente: string;
  nomeBarbeiro: string;
  servicos: ServicoAgendamento[];
  produtos?: ItemProduto[];
}