import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoOfflineService {

  constructor(private http: HttpClient, private authService: AuthService) {

   }

   getNotificacoesNaoLidas(nome: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}${environment.notificacaoEndpoint}/nao-lidas/${nome}`, {headers: this.authService.getHeaders()})
    .pipe(
      tap((response: any) => {
        console.log('Notificações não lidas recebidas com sucesso:', response);
      }),
      catchError((erros: any) => {
        console.error('Erro ao buscar notificações não lidas:', erros);
        throw erros;
      })
    );
    }

    markAsRead(notificacaoId: number): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}${environment.notificacaoEndpoint}/mark-as-read/${notificacaoId}`, {}, {headers: this.authService.getHeaders()})
      .pipe(
        tap((response: any) => {
          console.log('Notificação marcada como lida com sucesso:', response);
        }),
        catchError((erros: any) => {
          console.error('Erro ao marcar notificação como lida:', erros);
          throw erros;
        })
      );
    }

    markAllAsRead(): Observable<any> {
      return this.http.put<any>(`${environment.apiUrl}${environment.notificacaoEndpoint}/mark-all-as-read`, {}, {headers: this.authService.getHeaders()})
      .pipe(
        tap((response: any) => {
          console.log('Todas as notificações marcadas como lidas com sucesso:', response);
        }),
        catchError((erros: any) => {
          console.error('Erro ao marcar todas as notificações como lidas:', erros);
          throw erros;
        })
      );
    }
}
