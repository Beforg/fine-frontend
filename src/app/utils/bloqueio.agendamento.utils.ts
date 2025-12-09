
export interface BloqueioInfo {
    counter: number;
    blocked: boolean;
    expiration: Date | null;
}

export class BloqueioAgendamentoUtils {
    private static readonly STORAGE_KEY = 'ba-bf';
    private static readonly MAX_TENTATIVAS = 3;
    private static readonly HORAS_BLOQUEIO = 8;

    private static validarBloqueio(bloqueio: BloqueioInfo): boolean {
        if (!bloqueio.blocked) {
            return true;
        }

        const agora = new Date();
        const expiration = bloqueio.expiration ? new Date(bloqueio.expiration) : null;

        // Libera se a data atual for depois da expiração
        if (expiration && agora > expiration) {
            return true;
        }

        return false;
    }

    private static criarBloqueio(): BloqueioInfo {
        return {
            counter: 0,
            blocked: false,
            expiration: null
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
            return bloqueio;
        }
        return this.criarBloqueio();
    }

    public static obterBloqueioAtual(): BloqueioInfo {
        const bloqueio = this.carregarBloqueio();

        // Verifica se deve liberar o bloqueio
        if (bloqueio.blocked && !this.validarBloqueio(bloqueio)) {
            return bloqueio; // Retorna bloqueado
        }

        // Se passou da expiração, libera o bloqueio
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

        // Se ultrapassou o limite, bloqueia por 8 horas
        if (bloqueio.counter > this.MAX_TENTATIVAS) {
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