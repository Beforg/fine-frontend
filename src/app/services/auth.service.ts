import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
  login(credentials: LoginFormData): Observable<LoginResponse> {
    console.log('🔐 Tentando fazer login...', { login: credentials.login });
    console.log('📤 Enviando requisição para:', `${this.apiUrl}/login`);
    console.log('📦 Dados:', credentials);

    return this.http.post<BackendLoginResponse>(`${this.apiUrl}/login`, credentials, { headers: this.headers })
      .pipe(
        map((backendResponse: BackendLoginResponse) => {
          console.log('✅ Resposta raw do backend:', backendResponse);
          
          if (backendResponse.token) {
            // Armazenar token
            this.setToken(backendResponse.token);
            console.log('🎫 Token armazenado com sucesso');

            // Extrair dados do usuário do token
            const userData = this.getCurrentUser();
            console.log('👤 Dados do usuário extraídos:', userData);

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

            console.log('✅ Resposta padronizada:', standardResponse);
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

          console.log('🔍 Mensagem de erro extraída:', errorMessage);
          
          const errorResponse: LoginResponse = {
            success: false,
            message: errorMessage
          };
          return throwError(() => errorResponse);
        })
      );
  }

  register(credentials: RegisterFormData): Observable<BackendResponse> {
    console.log('🔐 Tentando registrar usuário...', { email: credentials.email });
    console.log('📤 Enviando requisição para:', `${this.apiUrl}/cadastrar`);
    console.log('📦 Dados:', credentials);
    
    return this.http.post<BackendResponse>(`${this.apiUrl}/cadastrar`, credentials, { headers: this.headers })
      .pipe(
        map((response: BackendResponse) => {
          console.log('✅ Resposta do registro:', response);
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Erro no registro:', error);
          
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

          console.log('🔍 Mensagem de erro de registro extraída:', errorMessage);
          
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
    return !!token && !this.isTokenExpired();
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
      const payload = JSON.parse(atob(token.split('.')[1]));
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
    console.log('🔍 Processando erro HTTP:', error);
    console.log('📊 Status HTTP:', error.status);
    console.log('📝 Error body:', error.error);
    
    // Primeiro, tentar extrair mensagem específica do backend
    if (error.error) {
      if (typeof error.error === 'string') {
        console.log('📝 Mensagem de erro (string):', error.error);
        return error.error;
      } else if (error.error.message) {
        console.log('📝 Mensagem de erro (object.message):', error.error.message);
        return error.error.message;
      } else if (error.error.error) {
        console.log('📝 Mensagem de erro (object.error):', error.error.error);
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
   * Obtém informações do usuário atual (decodifica do token)
   */
  getCurrentUser(): any {
    const token = this.getToken();
    console.log('🔍 Verificando token para getCurrentUser:', token ? 'Token existe' : 'Token não encontrado');
    
    if (!token) {
      console.log('❌ Nenhum token encontrado');
      return null;
    }

    try {
      console.log('🔓 Decodificando token JWT...');
      const parts = token.split('.');
      console.log('📊 Partes do token:', parts.length);
      
      if (parts.length !== 3) {
        console.error('❌ Token JWT inválido - não tem 3 partes');
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      console.log('✅ Payload decodificado:', payload);
      
      const userData = {
        id: payload.userId,
        email: payload.email,
        name: payload.nome,
        role: payload.role
      };
      
      console.log('👤 Dados do usuário extraídos:', userData);
      return userData;
    } catch (error) {
      console.error('❌ Erro ao decodificar token:', error);
      return null;
    }
  }
}
