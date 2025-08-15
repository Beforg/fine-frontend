export interface Barbeiro {
    barbeiroId: number;
    nome: string;
    telefone: string;
    visualizacoes: number;
    cortesRealizados: number;
    urlFoto: string;
    urlBackground: string;
    bio: string;
    especialidade: string;
    ativo: boolean;
}

export interface CadastroBarbeiro {
  nome: string;
  email: string;
  senha: string;
  especialidade: string;
  bio: string;
  urlFoto: string;
  urlBackground: string;
  telefone: string;

}

export interface EditarBarbeiro {
  barbeiroId: number;
  nome: string;
  especialidade: string;
  bio: string;
  urlFoto: string;
  urlBackground: string;
  telefone: string;
  ativo: boolean;

}

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    urlImagem: string;
    ativo: boolean;
    estoque: number; // Adicionado para representar o estoque
    // estoque
}

export interface CadastroProduto {
  nome: string;
  descricao: string;
  estoque: number;
  preco: number;
  urlImagem: string;
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
    ativo?: boolean;
}

export interface CadastroServico {
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