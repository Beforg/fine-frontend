import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginFormData, LoginResponse, BackendLoginResponse } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}${environment.authEndpoint}`; // URL dinâmica baseada no environment
  
  private tokenKey = 'authToken';
  private userDataKey = 'userData';

  constructor(private http: HttpClient) {
    console.log('🔧 AuthService inicializado com URL:', this.apiUrl);
  }

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    console.log('🔐 Tentando fazer login...', { login: credentials.login });

    // Configurar headers para CORS e Content-Type
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    try {
      console.log('📤 Enviando requisição para:', `${this.apiUrl}/login`);
      console.log('📦 Dados:', credentials);
      
      // Fazendo requisição para o backend (resposta raw)
      const backendResponse = await firstValueFrom(
        this.http.post<BackendLoginResponse>(`${this.apiUrl}/login`, credentials, { headers })
          .pipe(
            catchError(this.handleError)
          )
      );

      console.log('✅ Resposta raw do backend:', backendResponse);

      // Verificar se a resposta tem os campos necessários
      if (backendResponse.token && backendResponse.email && backendResponse.role) {
        // Armazenar token
        this.setToken(backendResponse.token);
        console.log('🎫 Token armazenado com sucesso');

        // Armazenar dados do usuário
        this.setUserData({
          email: backendResponse.email,
          role: backendResponse.role
        });
        console.log('👤 Dados do usuário armazenados');

        // Retornar resposta padronizada para o frontend
        const standardResponse: LoginResponse = {
          success: true,
          token: backendResponse.token,
          user: {
            email: backendResponse.email,
            role: backendResponse.role
          },
          message: 'Login realizado com sucesso!'
        };

        console.log('✅ Resposta padronizada:', standardResponse);
        return standardResponse;
      } else {
        console.error('❌ Resposta do backend inválida:', backendResponse);
        return {
          success: false,
          message: 'Resposta inválida do servidor'
        };
      }
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      // Trata erros específicos
      if (error instanceof HttpErrorResponse) {
        console.error('📊 Status do erro:', error.status);
        console.error('📝 Mensagem do erro:', error.message);
        console.error('🔍 Headers da resposta:', error.headers);
        console.error('📄 Corpo da resposta:', error.error);
        
        if (error.status === 403) {
          return {
            success: false,
            message: 'Acesso negado. Verifique suas credenciais ou entre em contato com o administrador.'
          };
        }
        
        if (error.status === 401) {
          return {
            success: false,
            message: 'E-mail ou senha incorretos'
          };
        }
        
        if (error.status === 400) {
          return {
            success: false,
            message: 'Dados inválidos. Verifique os campos.'
          };
        }
        
        if (error.status === 0) {
          return {
            success: false,
            message: 'Erro de CORS ou servidor indisponível. Verifique se o backend está rodando.'
          };
        }
        
        if (error.status >= 500) {
          return {
            success: false,
            message: 'Erro interno do servidor. Tente novamente mais tarde.'
          };
        }
      }

      return {
        success: false,
        message: 'Erro de conexão. Verifique sua internet.'
      };
    }
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    this.removeToken();
    this.removeUserData();
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Obtém o token armazenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Armazena o token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Remove o token
   */
  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Armazena dados do usuário
   */
  private setUserData(userData: { email: string; role: string }): void {
    localStorage.setItem(this.userDataKey, JSON.stringify(userData));
  }

  /**
   * Obtém dados do usuário armazenados
   */
  getUserData(): { email: string; role: string } | null {
    const userData = localStorage.getItem(this.userDataKey);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Remove dados do usuário
   */
  private removeUserData(): void {
    localStorage.removeItem(this.userDataKey);
  }

  /**
   * Obtém a role do usuário atual
   */
  getUserRole(): string | null {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }

  /**
   * Obtém o email do usuário atual
   */
  getUserEmail(): string | null {
    const userData = this.getUserData();
    return userData ? userData.email : null;
  }

  /**
   * Verifica se o usuário tem uma role específica
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  /**
   * Verifica se o token está expirado
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  /**
   * Trata erros HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro na requisição:', error);
    return throwError(() => error);
  }

  /**
   * Exemplo de método para refresh token (se necessário)
   */
  async refreshToken(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.apiUrl}/auth/refresh`, {})
      );

      if (response.token) {
        this.setToken(response.token);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Obtém informações do usuário atual (decodifica do token)
   */
  getCurrentUser(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name
      };
    } catch {
      return null;
    }
  }
}
