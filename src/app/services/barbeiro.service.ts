import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Barbeiro, CadastroBarbeiro, EditarBarbeiro, HorarioTrabalhoDia } from '../interfaces/entities.interface';
import { environment } from '../../environments/environment';
import { BackendResponse } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class BarbeiroService {

  private apiUrl = `${environment.apiUrl}${environment.barbeirosEndpoint}`
  
  constructor(private http: HttpClient, private authService: AuthService) {

   }

   getBarbeiros(): Observable<Barbeiro[]> {
     return this.http.get<Barbeiro[]>(`${this.apiUrl}/listar`).pipe(
       tap(response => {
         console.log("Barbeiros recebidos:", response);
       }),
       catchError(error => {
         console.error('Erro ao buscar barbeiros:', error);
         return of([]);
       })
     );
   }

   getHorariosTrabalhoBarbeiro(idBarbeiro: number): Observable<HorarioTrabalhoDia[]> {
      return this.http.get<HorarioTrabalhoDia[]>(`${this.apiUrl}/horarios/${idBarbeiro}`,  {headers: this.authService.getHeaders()}).pipe(
         tap(response => {
            console.log("Horários de trabalho recebidos:", response);
         }),
         catchError(error => {
            console.error('Erro ao buscar horários de trabalho:', error);
            return of([]);
         })
      );
   }

   getBarbeiroById(id: number): Observable<Barbeiro> {
     return this.http.get<Barbeiro>(`${this.apiUrl}/listar/${id}`).pipe(
       tap(response => {
         console.log("Barbeiro encontrado:", response);
       }),
       catchError(error => {
         console.error('Erro ao buscar barbeiro:', error);
         throw error;
       })
     );
   }

   cadastrarBarbeiro(novoBarbeiro: CadastroBarbeiro): Observable<any> {
     return this.http.post<any>(`${this.apiUrl}/cadastrar`, novoBarbeiro, {headers: this.authService.getHeaders()}).pipe(
       tap(response => {
         console.log("Barbeiro cadastrado:", response);
       }),
       catchError(error => {
         console.error('Erro ao cadastrar barbeiro:', error);
         return of({ message: 'Erro ao cadastrar barbeiro.', httpStatus: 'ERROR' });
       })
     );
   }

   editarBarbeiro(barbeiro: EditarBarbeiro): Observable<any> {
     return this.http.put<any>(`${this.apiUrl}/editar`, barbeiro, {headers: this.authService.getHeaders()}).pipe(
       tap(response => {
         console.log("Barbeiro editado:", response);
       }),
       catchError(error => {
         console.error('Erro ao editar barbeiro:', error);
         return of({ message: 'Erro ao editar barbeiro.', httpStatus: 'ERROR' });
       })
     );
   }

   incrementarVisualizacao(id: number): Observable<BackendResponse> {
     return this.http.post<BackendResponse>(`${this.apiUrl}/visualizar/${id}`, { headers: this.authService.getHeaders() }).pipe(
       tap(response => {
         console.log("Visualização incrementada:", response);
       }),
       catchError(error => {
         console.error('Erro ao incrementar visualização:', error);
         return of({ message: 'Erro ao incrementar visualização.', httpStatus: 'ERROR' });
       })
     );
   }

}
