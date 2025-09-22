import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Indisponibilidade } from '../interfaces/entities.interface';
import { Observable } from 'rxjs';
import { BackendResponse } from '../interfaces/response.interface';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IndisponibilidadeService {

  private apiUrl = `${environment.apiUrl}${environment.IndisponibilidadeEndpoint}`; // Ajuste a URL conforme necessário

  constructor(private httpClient: HttpClient) { }

  registrarIndisponibilidade(indisponibilidade: Indisponibilidade): Observable<BackendResponse> {
    return this.httpClient.post<BackendResponse>(this.apiUrl, indisponibilidade).pipe(
      
    );
  }
}
