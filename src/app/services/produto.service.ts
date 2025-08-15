import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { CadastroProduto, Produto } from '../interfaces/entities.interface';
import { BackendResponse } from '../interfaces/response.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private http: HttpClient, private authService: AuthService) {

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

  cadastrarProduto(novoProduto: CadastroProduto): Observable<BackendResponse> {
    return this.http.post<BackendResponse>(`${environment.apiUrl}${environment.produtosEndpoint}/cadastrar`, novoProduto, { headers: this.authService.getHeaders() }).pipe(
      tap(response => {
        console.log("Produto cadastrado:", response);
      }),
      catchError(error => {
        console.error('Erro ao cadastrar produto:', error);
        return of({ sucesso: false, mensagem: 'Erro ao cadastrar produto', message: 'Erro ao cadastrar produto', httpStatus: '500' });
      })
    );
  }

  editarProduto(produto: Produto): Observable<any> {
    return this.http.put<Produto>(`${environment.apiUrl}${environment.produtosEndpoint}/editar`, produto, { headers: this.authService.getHeaders() }).pipe(
      tap(response => {
        console.log("Produto editado:", response);
      }),
      catchError(error => {
        console.error('Erro ao editar produto:', error);
        return of({ sucesso: false, mensagem: 'Erro ao editar produto', message: 'Erro ao editar produto', httpStatus: '500' });
      })
    );
  }

  desativarProduto(id: number): Observable<BackendResponse> {
    return this.http.delete<BackendResponse>(`${environment.apiUrl}${environment.produtosEndpoint}/desativar/${id}`, { headers: this.authService.getHeaders() }).pipe(
      tap(response => {
        console.log("Produto desativado:", response);
      }),
      catchError(error => {
        console.error('Erro ao desativar produto:', error);
        return of({ sucesso: false, mensagem: 'Erro ao desativar produto', message: 'Erro ao desativar produto', httpStatus: '500' });
      })
    );
  }

  }
