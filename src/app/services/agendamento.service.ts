import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AgendamentoRequest, HorarioDisponivel } from '../interfaces/entities.interface';
import { Observable } from 'rxjs';
import { BackendResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private apiUrl= `${environment.apiUrl}${environment.agendamentoEndpoint}`; // URL dinâmica baseada no environment

  constructor(private http: HttpClient, private authService: AuthService) { }

   criarAgendamento(agendamentoRequest: AgendamentoRequest): Observable<BackendResponse> {
     return this.http.post<BackendResponse>(this.apiUrl, agendamentoRequest, { headers: this.authService.getHeaders() }).pipe(
       tap((response: BackendResponse) => {
         console.log('Agendamento criado com sucesso:', response);
       }),catchError((erros: HttpErrorResponse) => {
         console.error('Erro ao criar agendamento:', erros);
         throw erros;
       })
     );
  }

  listarHorariosDisponiveis(barbeiroId: number, data: Date, servicosIds: number[]): Observable<HorarioDisponivel[]> {
    const url = `${this.apiUrl}/horarios`;
    const params = {
      barbeiroId: barbeiroId.toString(),
      data: data.toISOString(),
      servicosIds: servicosIds.join(',')
    };
    return this.http.get<HorarioDisponivel[]>(url, { headers: this.authService.getHeaders(), params }).pipe(
      tap((response: HorarioDisponivel[]) => {
        console.log('Horários disponíveis:', response);
      }),
      catchError((erros: HttpErrorResponse) => {
        console.error('Erro ao listar horários disponíveis:', erros);
        throw erros;
      })
    );
  }
}
