import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Servico } from '../interfaces/entities.interface';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  constructor(private http: HttpClient) { }

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
}
