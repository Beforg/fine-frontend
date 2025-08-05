import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Barbeiro } from '../interfaces/entities.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BarbeiroService {

  private apiUrl = `${environment.apiUrl}${environment.barbeirosEndpoint}`
  
  constructor(private http: HttpClient) {

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

   getBarbeiroById(id: number): Observable<Barbeiro> {
     return this.http.get<Barbeiro>(`${this.apiUrl}/${id}`).pipe(
       tap(response => {
         console.log("Barbeiro encontrado:", response);
       }),
       catchError(error => {
         console.error('Erro ao buscar barbeiro:', error);
         throw error;
       })
     );
   }

}
