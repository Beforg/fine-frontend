import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  constructor(private http: HttpClient, private authService: AuthService) { }


  obterReceitaPorPeriodo(dataInicio: string, dataFim: string) {
    return this.http.get<any>(`${environment.apiUrl}${environment.financeiroEndpoint}/receita-periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`, 
      { headers: this.authService.getHeaders() }).pipe(
        tap((response: any) => {
          console.log('Receita por período recebida com sucesso:', response);
        }),
        catchError((erros: any) => {
          console.error('Erro ao buscar receita por período:', erros);
          throw erros;
        })
      );
  }

}
