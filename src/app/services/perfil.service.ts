import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, tap, catchError, of, throwError } from 'rxjs';
import { UserInfo } from '../interfaces/entities.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private apiUrl = `${environment.apiUrl}${environment.perfilEndpoint}`
  private headers!: { Authorization: string };
  constructor(private http: HttpClient, private authService: AuthService) { 
    const token = this.authService.getToken();
    this.headers = {
      Authorization: `Bearer ${token}`
    };
  }

  getUserInfos(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/me`, { headers: this.headers }).pipe(
       tap(response => {
         console.log("Informações do usuário recebidas:", response);
       }),
       catchError(error => {
         console.error('Erro ao buscar informações do usuário:', error);
         return throwError(() => error);
       })
    );
  }

}
