import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginFormData, LoginResponse, BackendLoginResponse } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { RegisterFormData } from '../interfaces/register-form.interface';
import { BackendResponse } from '../interfaces/response.interface';
import { UserRole } from '../enums/user-role.enum';

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
  login(credentials: LoginFormData): Observable<LoginResponse> {

    return this.http.post<BackendLoginResponse>(`${this.apiUrl}/login`, credentials, { headers: this.headers })
      .pipe(
        map((backendResponse: BackendLoginResponse) => {
          if (backendResponse.token) {
            // Armazenar token
            this.setToken(backendResponse.token);

            // Extrair dados do usuário do token
            const userData = this.getCurrentUser();

            // Retornar resposta padronizada para o frontend
            const standardResponse: LoginResponse = {
              success: true,
              token: backendResponse.token,
              message: 'Login realizado com sucesso!',
              user: userData ? {
                email: userData.email || '',
                role: userData.role || 'user'
              } : undefined
            };

            return standardResponse;
          } else {
            console.error('❌ Token não encontrado na resposta:', backendResponse);
            const errorResponse: LoginResponse = {
              success: false,
              message: 'Token não encontrado na resposta do servidor'
            };
            return errorResponse;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Erro no login:', error);
          
          // Extrair mensagem de erro do backend
          let errorMessage = 'Erro ao fazer login. Tente novamente mais tarde.';
          
          if (error.error) {

            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error.error) {
              errorMessage = error.error.error;
            }
          } else {
            // Usar getErrorMessage para status codes específicos
            errorMessage = this.getErrorMessage(error);
          }

          
          const errorResponse: LoginResponse = {
            success: false,
            message: errorMessage
          };
          return throwError(() => errorResponse);
        })
      );
  }

  register(credentials: RegisterFormData): Observable<BackendResponse> {
    
    return this.http.post<BackendResponse>(`${this.apiUrl}/cadastrar`, credentials, { headers: this.headers })
      .pipe(
        map((response: BackendResponse) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          
          // Extrair mensagem de erro do backend
          let errorMessage = 'Erro ao registrar usuário. Tente novamente mais tarde.';
          
          if (error.error) {
            // Se o backend retornou uma mensagem específica
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error.error) {
              errorMessage = error.error.error;
            }
          } else {
            // Usar getErrorMessage para status codes específicos
            errorMessage = this.getErrorMessage(error);
          }
          
          const errorResponse: BackendResponse = {
            message: errorMessage,
            httpStatus: error.status?.toString() || "500"
          };
          return throwError(() => errorResponse);
        })
      );
  }
  /**
   * Realiza logout do usuário
   */
  logout(): void {
    this.removeToken();
  
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (this.isTokenExpired()) {
      this.removeToken();
      return false;
    }
    return !!token && !this.isTokenExpired();
  }

  /**
   * Obtém o token armazenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getHeaders(): {Authorization: string} {
    const token = this.getToken();
    if (!token) {
      console.warn('🔍 Nenhum token encontrado para headers');
      return {
        Authorization: '' // Retorna um header vazio se não houver token
      };
    }
    return { Authorization: `Bearer ${token}` };

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
  // private setUserData(userData: { email: string; role: string }): void {
  //   localStorage.setItem(this.userDataKey, JSON.stringify(userData));
  // }

  // /**
  //  * Obtém dados do usuário armazenados
  //  */
  // getUserData(): { email: string; role: string } | null {
  //   const userData = localStorage.getItem(this.userDataKey);
  //   return userData ? JSON.parse(userData) : null;
  // }

  // /**
  //  * Remove dados do usuário
  //  */
  // private removeUserData(): void {
  //   localStorage.removeItem(this.userDataKey);
  // }


  // /**
  //  * Obtém o email do usuário atual
  //  */
  // getUserEmail(): string | null {
  //   const userData = this.getUserData();
  //   return userData ? userData.email : null;
  // }


  /**
   * Verifica se o token está expirado
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      const decodedPayload = this.decodeBase64(parts[1]);
      const payload = JSON.parse(decodedPayload);
      const exp = payload.exp * 1000; // Converter para milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  /**
   * Obtém mensagem de erro personalizada baseada no erro HTTP
   */
  private getErrorMessage(error: HttpErrorResponse): string {

    
    // Primeiro, tentar extrair mensagem específica do backend
    if (error.error) {
      if (typeof error.error === 'string') {

        return error.error;
      } else if (error.error.message) {

        return error.error.message;
      } else if (error.error.error) {

        return error.error.error;
      }
    }
    
    // Caso não tenha mensagem específica, usar mensagens baseadas no status
    switch (error.status) {
      case 400:
        return 'Dados inválidos. Verifique as informações e tente novamente.';
      case 401:
        return 'Email ou senha incorretos.';
      case 403:
        return 'Usuário ou senha inválidos.'; // Específico para 403
      case 409:
        return 'Este email já está em uso.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      case 0:
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      default:
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
  }

  /**
   * Decodifica base64 de forma segura, tratando caracteres especiais
   */
  private decodeBase64(str: string): string {
    try {
      // Substituir caracteres URL-safe por base64 padrão
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      
      // Adicionar padding se necessário
      while (str.length % 4) {
        str += '=';
      }

      // Decodificar e tratar caracteres UTF-8
      const decoded = atob(str);
      return decodeURIComponent(
        decoded.split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
    } catch (e) {
      console.error('Erro ao decodificar base64:', e);
      throw e;
    }
  }

  /**
   * Obtém informações do usuário atual (decodifica do token)
   */
  getCurrentUser(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        console.error('Token JWT inválido: formato incorreto');
        return null;
      }

      // Decodificar payload usando método seguro
      const decodedPayload = this.decodeBase64(parts[1]);
      const payload = JSON.parse(decodedPayload);
      
      const userData = {
        id: payload.userId,
        email: payload.email,
        name: payload.nome,
        role: payload.role,
        telefone: payload.telefone
      };
      
      return userData;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      // Limpar token corrompido
      this.removeToken();
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === UserRole.ADMIN;
  }
}
