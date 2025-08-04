import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Produto } from '../interfaces/entities.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private http: HttpClient) {

  }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${environment.apiUrl}${environment.produtosEndpoint}/listar`).pipe(
      tap(response => {
        console.log("Produtos recebidos:", response);
      }),
      catchError(error => {
        console.error('Erro ao buscar produtos:', error);
        return of([]);
      })
    );
  }
}
