import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CadastroServico, Servico } from '../interfaces/entities.interface';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { BackendResponse } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${environment.apiUrl}${environment.servicosEndpoint}/listar`).pipe(
      tap(response => {
        console.log("Serviços recebidos:", response);
      }),
      catchError(error => {
        console.error('Erro ao buscar serviços:', error);
        return of([]);
      })
    );
  }

  cadastrarServico(novoServico: CadastroServico): Observable<BackendResponse> {
    return this.http.post<BackendResponse>(`${environment.apiUrl}${environment.servicosEndpoint}/cadastrar`, novoServico, { headers: this.authService.getHeaders() }).pipe(
      tap(response => {
        console.log("Serviço cadastrado:", response);
      }),
      catchError(error => {
        console.error('Erro ao cadastrar serviço:', error);
        // Return a default BackendResponse object in case of error
        return of({ message: 'Erro ao cadastrar serviço.', httpStatus: 'ERROR' });
      })
    );
  }

  editarServico(servico: Servico): Observable<Servico | null> {
    return this.http.put<Servico>(`${environment.apiUrl}${environment.servicosEndpoint}/editar`, servico, { headers: this.authService.getHeaders() }).pipe(
      tap(response => {
        console.log("Serviço editado:", response);
      }),
      catchError((error: any) => {
        console.error('Erro ao editar serviço:', error);
        // Return null in case of error
        return of(null);
      })
    );
  }

  excluirServico(servicoId: number): Observable<BackendResponse> {
    return this.http.delete<BackendResponse>(`${environment.apiUrl}${environment.servicosEndpoint}/excluir/${servicoId}`, { headers: this.authService.getHeaders() }).pipe(
      tap(response => {
        console.log("Serviço excluído:", response);
      }),
      catchError(error => {
        console.error('Erro ao excluir serviço:', error);
        // Return a default BackendResponse object in case of error
        return of({ message: 'Erro ao excluir serviço.', httpStatus: 'ERROR' });
      })
    );
  }
}
