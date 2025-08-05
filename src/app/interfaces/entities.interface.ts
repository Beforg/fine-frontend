export interface Barbeiro {
    id: number;
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
}

export interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
}

export interface UserInfo {
    nome: string;
    telefone: string;
    dataCadastro: string;
}