export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  cpf_cnpj: string;
  email?: string;
  endereco: string;
  cidade: string;
  cep: string;
  created_at: string;
  updated_at: string;
}

export interface OrdemServico {
  id: string;
  numero: string;
  cliente_id: string;
  cliente?: Cliente;
  tipo_dispositivo: string;
  marca: string;
  modelo: string;
  numero_serie?: string;
  imei?: string;
  codigo_interno?: string;
  problema_relatado: string;
  diagnostico_tecnico?: string;
  tipo_garantia: 'fabrica' | 'loja' | 'nenhuma';
  status_garantia: 'valida' | 'expirada' | 'nao_aplicavel';
  data_expiracao_garantia?: string;
  status: 'aberta' | 'aguardando_peca' | 'em_manutencao' | 'concluida' | 'entregue' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  tipo_defeito: string;
  sla_prazo?: string;
  tecnico_responsavel?: string;
  valor_orcamento?: number;
  valor_total?: number;
  observacoes?: string;
  checklist_entrada?: string;
  checklist_saida?: string;
  assinatura_digital?: string;
  created_at: string;
  updated_at: string;
  data_previsao?: string;
  data_conclusao?: string;
}

export interface Peca {
  id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  estoque_atual: number;
  estoque_minimo: number;
  preco_custo: number;
  preco_venda: number;
  fornecedor?: string;
  categoria: string;
  created_at: string;
  updated_at: string;
}

export interface PecaUtilizada {
  id: string;
  os_id: string;
  peca_id: string;
  peca?: Peca;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  created_at: string;
}

export interface AnexoOS {
  id: string;
  os_id: string;
  nome_arquivo: string;
  tipo_arquivo: string;
  caminho: string;
  descricao?: string;
  created_at: string;
}

export interface HistoricoOS {
  id: string;
  os_id: string;
  status_anterior: string;
  status_novo: string;
  usuario_id: string;
  usuario_nome?: string;
  observacoes?: string;
  created_at: string;
}

export type StatusOS = 'aberta' | 'aguardando_peca' | 'em_manutencao' | 'concluida' | 'entregue' | 'cancelada';
export type PrioridadeOS = 'baixa' | 'media' | 'alta' | 'critica';
export type TipoGarantia = 'fabrica' | 'loja' | 'nenhuma';
export type StatusGarantia = 'valida' | 'expirada' | 'nao_aplicavel';

export const STATUS_CORES = {
  aberta: 'bg-blue-100 text-blue-800',
  aguardando_peca: 'bg-yellow-100 text-yellow-800',
  em_manutencao: 'bg-orange-100 text-orange-800',
  concluida: 'bg-green-100 text-green-800',
  entregue: 'bg-gray-100 text-gray-800',
  cancelada: 'bg-red-100 text-red-800',
};

export const PRIORIDADE_CORES = {
  baixa: 'bg-gray-100 text-gray-800',
  media: 'bg-blue-100 text-blue-800',
  alta: 'bg-orange-100 text-orange-800',
  critica: 'bg-red-100 text-red-800',
};