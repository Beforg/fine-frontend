import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Indisponibilidade, RegistroIndisponibilidade } from '../interfaces/entities.interface';
import { map, Observable } from 'rxjs';
import { BackendResponse } from '../interfaces/response.interface';
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
}
