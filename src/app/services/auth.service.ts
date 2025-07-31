import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginFormData, LoginResponse, BackendLoginResponse } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { RegisterFormData } from '../interfaces/register-form.interface';
import { BackendResponse } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}${environment.authEndpoint}`; // URL dinâmica baseada no environment
  
  private tokenKey = 'authToken';
  private userDataKey = 'userData';

  headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

  constructor(private http: HttpClient) {
    console.log('🔧 AuthService inicializado com URL:', this.apiUrl);
  }

  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    console.log('🔐 Tentando fazer login...', { login: credentials.login });

    try {
      console.log('📤 Enviando requisição para:', `${this.apiUrl}/login`);
      console.log('📦 Dados:', credentials);
  
      // Fazendo requisição para o backend (resposta raw)
      const backendResponse = await firstValueFrom(
        this.http.post<BackendLoginResponse>(`${this.apiUrl}/login`, credentials, { headers: this.headers })
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
      return {
        success: false,
        message: (error as HttpErrorResponse).error || 'Erro ao fazer login. Tente novamente mais tarde.',
      };
    }
  }

  async register(credentials: RegisterFormData): Promise<BackendResponse> {
    console.log('🔐 Tentando registrar usuário...', { email: credentials.email });

    try {
      console.log('📤 Enviando requisição para:', `${this.apiUrl}/register`);
      console.log('📦 Dados:', credentials);
      
      const response = await firstValueFrom(
        this.http.post<BackendResponse>(`${this.apiUrl}/cadastrar`, credentials, { headers: this.headers })
          .pipe(catchError(this.handleError))
      );

      console.log('✅ Resposta do registro:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      return {
        message: (error as HttpErrorResponse).error.message || 'Erro ao registrar usuário. Tente novamente mais tarde.',
        httpStatus: (error as HttpErrorResponse).error.httpStatus || "500"
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
