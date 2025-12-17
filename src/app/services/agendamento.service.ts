import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgendamentoRequest, HorarioDisponivel } from '../interfaces/entities.interface';
import { Observable } from 'rxjs';
import { BackendResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { catchError, tap } from 'rxjs';
import { AgendamentoStatus } from '../enums/agendamento-status.enum';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl= `${environment.apiUrl}${environment.agendamentoEndpoint}`; // URL dinâmica baseada no environment

  constructor(private http: HttpClient, private authService: AuthService) { }

   criarAgendamento(agendamentoRequest: AgendamentoRequest): Observable<BackendResponse> {
     return this.http.post<BackendResponse>(`${this.apiUrl}/agendar`, agendamentoRequest, { headers: this.authService.getHeaders() }).pipe(
       tap((response: BackendResponse) => {
         console.log('Agendamento criado com sucesso:', response);
       }),catchError((erros: HttpErrorResponse) => {
         console.error('Erro ao criar agendamento:', erros);
         throw erros;
       })
     );
  }

  listarHorariosDisponiveis(barbeiroId: number, data: string, servicoIds: number[]): Observable<string[]> {
    const url = `${this.apiUrl}/horarios`;
    const params = {
      barbeiroId: barbeiroId.toString(),
      data: data.toString(),
      servicoIds: servicoIds.join(',')
    };
    return this.http.get<string[]>(url, { params }).pipe(
      tap((response: string[]) => {
        console.log('Horários disponíveis:', response);
      }),
      catchError((erros: HttpErrorResponse) => {
        console.error('Erro ao listar horários disponíveis:', erros);
        throw erros;
      })
    );
  }

  listarAgendamentos(data: {id: string, page: string, size: string, filtro: string}): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/listar/${data.id}?page=${data.page}&size=${data.size}&filtro=${data.filtro}`, { headers: this.authService.getHeaders() }).pipe(
      tap((response: any) => {
        console.log('Agendamentos listados com sucesso:', response);
      }),
      catchError((erros: HttpErrorResponse) => {
        console.error('Erro ao listar agendamentos:', erros);
        throw erros;
      })
    );
  }

  editarValorTotal(agendamentoId: number, novoValor: number): Observable<any> {
    const data: {id: number, valor: number} = { id: agendamentoId, valor: novoValor };
    return this.http.put<any>(`${this.apiUrl}/editar`, data, { headers: this.authService.getHeaders() }).pipe(
      tap((response: any) => {
        console.log('Valor total do agendamento editado com sucesso:', response);
      }),
      catchError((erros: HttpErrorResponse) => {
        console.error('Erro ao editar valor total do agendamento:', erros);
        throw erros;
      })
    );
  }

  alterarStatusAgendamento(status: AgendamentoStatus, id: string, comprouProdutos: boolean): Observable<any> {
    console.log('Headers sendo enviados:', this.authService.getHeaders());
    console.log('Status:', status, 'ID:', id);
    
    const headers = this.authService.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/status/${id}?status=${status}&comprouProdutos=${comprouProdutos}`, {}, { headers }).pipe(
      tap((response: any) => {
        console.log('Status do agendamento alterado com sucesso:', response);
      }),
      catchError((erros: HttpErrorResponse) => {
        console.error('Erro ao alterar status do agendamento:', erros);
        console.error('Detalhes do erro:', {
          status: erros.status,
          statusText: erros.statusText,
          error: erros.error,
          url: erros.url
        });
        throw erros;
      })
    );  
  }
}