
export interface BloqueioInfo {
    counter: number;
    blocked: boolean;
    expiration: Date | null;
    lastResetDate: string; // Data do último reset (formato YYYY-MM-DD)
}

export class BloqueioAgendamentoUtils {
    private static readonly STORAGE_KEY = 'ba-bf';
    private static readonly MAX_AGENDAMENTOS_DIA = 3;
    private static readonly HORAS_BLOQUEIO = 8;

    private static obterDataAtual(): string {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`; // Formato YYYY-MM-DD no fuso horário local
    }

    private static validarBloqueio(bloqueio: BloqueioInfo): boolean {
        const agora = new Date();
        const dataAtual = this.obterDataAtual();

        // Se mudou de dia, deve resetar
        if (bloqueio.lastResetDate !== dataAtual) {
            return true; // Libera para resetar
        }

        // Se está bloqueado, verifica a expiração
        if (bloqueio.blocked) {
            const expiration = bloqueio.expiration ? new Date(bloqueio.expiration) : null;
            
            // Libera se a data atual for depois da expiração
            if (expiration && agora > expiration) {
                return true;
            }
            return false;
        }

        return true;
    }

    private static criarBloqueio(): BloqueioInfo {
        return {
            counter: 0,
            blocked: false,
            expiration: null,
            lastResetDate: this.obterDataAtual()
        };
    }

    private static salvarBloqueio(bloqueio: BloqueioInfo): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bloqueio));
    }

    private static carregarBloqueio(): BloqueioInfo {
        const dados = localStorage.getItem(this.STORAGE_KEY);
        if (dados) {
            const bloqueio = JSON.parse(dados);
            // Converte a string de data de volta para Date
            if (bloqueio.expiration) {
                bloqueio.expiration = new Date(bloqueio.expiration);
            }
            // Garante que lastResetDate existe (para compatibilidade com versões antigas)
            if (!bloqueio.lastResetDate) {
                bloqueio.lastResetDate = this.obterDataAtual();
            }
            return bloqueio;
        }
        return this.criarBloqueio();
    }

    public static obterBloqueioAtual(): BloqueioInfo {
        const bloqueio = this.carregarBloqueio();
        const dataAtual = this.obterDataAtual();

        // Se mudou de dia, reseta automaticamente
        if (bloqueio.lastResetDate !== dataAtual) {
            return this.liberar();
        }

        // Verifica se deve liberar o bloqueio (expiração das 8 horas)
        if (bloqueio.blocked && this.validarBloqueio(bloqueio)) {
            return this.liberar();
        }

        return bloqueio;
    }

    public static incrementarTentativa(): BloqueioInfo {
        const bloqueio = this.obterBloqueioAtual();

        // Se já está bloqueado e não expirou, retorna o bloqueio atual
        if (bloqueio.blocked && !this.validarBloqueio(bloqueio)) {
            return bloqueio;
        }

        // Incrementa o contador
        bloqueio.counter += 1;

        // Se atingiu o limite de agendamentos do dia, bloqueia por 8 horas
        if (bloqueio.counter >= this.MAX_AGENDAMENTOS_DIA) {
            const agora = new Date();
            bloqueio.blocked = true;
            bloqueio.expiration = new Date(agora.getTime() + this.HORAS_BLOQUEIO * 60 * 60 * 1000);
        }

        this.salvarBloqueio(bloqueio);
        return bloqueio;
    }

    public static liberar(): BloqueioInfo {
        const bloqueio = this.criarBloqueio();
        this.salvarBloqueio(bloqueio);
        return bloqueio;
    }

    public static estaBloqueado(): boolean {
        const bloqueio = this.obterBloqueioAtual();
        return bloqueio.blocked && !this.validarBloqueio(bloqueio);
    }

    public static obterTempoRestante(): number | null {
        const bloqueio = this.obterBloqueioAtual();
        
        if (!bloqueio.blocked || !bloqueio.expiration) {
            return null;
        }

        const agora = new Date();
        const expiration = new Date(bloqueio.expiration);
        const diferenca = expiration.getTime() - agora.getTime();

        return diferenca > 0 ? diferenca : null;
    }

    public static obterTempoRestanteFormatado(): string | null {
        const tempoRestante = this.obterTempoRestante();
        
        if (!tempoRestante) {
            return null;
        }

        const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
        const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));

        return `${horas}h ${minutos}min`;
    }
}