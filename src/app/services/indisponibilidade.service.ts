import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Indisponibilidade, RegistroIndisponibilidade } from '../interfaces/entities.interface';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IndisponibilidadeService {

  private apiUrl = `${environment.apiUrl}${environment.IndisponibilidadeEndpoint}`; // Ajuste a URL conforme necessário

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  registrarIndisponibilidade(indisponibilidade: RegistroIndisponibilidade): Observable<any> {
    return this.httpClient.post<Indisponibilidade>(`${this.apiUrl}/registrar`, indisponibilidade, { headers: this.authService.getHeaders()}).pipe(
    );
  }

  registrarFeriado(indisponibilidades: RegistroIndisponibilidade[]): Observable<any> {
    return this.httpClient.post<Indisponibilidade[]>(`${this.apiUrl}/registrar/feriado`, indisponibilidades, { headers: this.authService.getHeaders()}).pipe(
      map(response => response as Indisponibilidade[])
    );
  }

  listarIndisponibilidades(): Observable<Indisponibilidade[]> {
    return this.httpClient.get<Indisponibilidade[]>(`${this.apiUrl}/listar`, { headers: this.authService.getHeaders()}).pipe(
      map(response => response as Indisponibilidade[])
    );
  }

  excluirIndisponibilidade(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/excluir/${id}`, { headers: this.authService.getHeaders()});
  }
}
