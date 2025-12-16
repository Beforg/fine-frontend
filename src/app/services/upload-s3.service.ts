import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UploadUrlResponse {
  signedUrl: string;
  publicUrl: string;
}

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadS3Service {

  private apiUrl = `${environment.apiUrl}/storage`;

  constructor(private http: HttpClient) { }

  /**
   * Obtém o token JWT do localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Cria headers com autenticação
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  /**
   * 1. Solicita URL pré-assinada do backend (COM AUTENTICAÇÃO)
   */
  private getPresignedUrl(fileName: string, contentType: string): Observable<UploadUrlResponse> {
    const params = { fileName, contentType };
    const headers = this.getAuthHeaders();
    
    return this.http.get<UploadUrlResponse>(`${this.apiUrl}/url-upload`, { 
      params,
      headers 
    });
  }

  /**
   * 2. Faz upload direto para o S3 usando a URL assinada
   */
  private uploadToS3(file: File, signedUrl: string): Observable<any> {
    console.log('📤 Fazendo upload para S3...');
    console.log('   📄 Arquivo:', file.name);
    console.log('   📏 Tamanho:', (file.size / 1024).toFixed(2), 'KB');
    console.log('   🏷️ Content-Type:', file.type);
    console.log('   🔗 URL completa assinada:', signedUrl);
    
    // Usar XMLHttpRequest para ter controle total dos headers
    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('PUT', signedUrl, true);
      
      // NÃO definir Content-Type aqui! 
      // O browser vai inferir automaticamente do File object
      // Se o backend incluiu content-type nos signed headers, isso causa erro de assinatura
      // xhr.setRequestHeader('Content-Type', file.type);
      
      xhr.onload = () => {
        console.log('📡 Resposta do S3:');
        console.log('   Status:', xhr.status, xhr.statusText);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('   ✅ Upload para S3 concluído!');
          observer.next(xhr.response);
          observer.complete();
        } else {
          console.error('   ❌ Corpo do erro S3:', xhr.responseText);
          observer.error(new Error(`S3 Upload falhou: ${xhr.status} ${xhr.statusText} - ${xhr.responseText}`));
        }
      };
      
      xhr.onerror = () => {
        console.error('   ❌ Erro de rede ao fazer upload para S3');
        observer.error(new Error('Erro de rede ao fazer upload para S3'));
      };
      
      xhr.send(file);
    });
  }

  /**
   * 3. Método principal: Upload completo (solicita URL + faz upload)
   */
  uploadFile(file: File): Observable<UploadResult> {
    console.log('📤 Iniciando upload para S3:', file.name);
    console.log('   📋 Tipo:', file.type);
    console.log('   📏 Tamanho:', (file.size / 1024).toFixed(2), 'KB');

    return this.getPresignedUrl(file.name, file.type).pipe(
      switchMap(response => {
        console.log('✅ URL pré-assinada obtida:');
        console.log('   🔗 Public URL:', response.publicUrl);
        console.log('   🔐 Signed URL (primeiros 100 chars):', response.signedUrl.substring(0, 100) + '...');
        
        return this.uploadToS3(file, response.signedUrl).pipe(
          switchMap(() => {
            console.log('✅ Upload para S3 concluído com sucesso!');
            console.log('   🌐 URL pública:', response.publicUrl);
            return from(Promise.resolve({
              success: true,
              publicUrl: response.publicUrl
            }));
          })
        );
      })
    );
  }

  /**
   * 4. Upload de foto de barbeiro (foto de perfil ou background)
   */
  uploadBarbeiroPhoto(file: File, barbeiroId: number, isBackground: boolean = false): Observable<UploadResult> {
    const prefix = isBackground ? 'barbeiro-bg' : 'barbeiro';
    const customFileName = `${prefix}-${barbeiroId}-${Date.now()}.${this.getFileExtension(file.name)}`;
    
    // Cria um novo File com nome customizado
    const renamedFile = new File([file], customFileName, { type: file.type });
    
    return this.uploadFile(renamedFile);
  }

  /**
   * 5. Upload de foto de produto
   */
  uploadProdutoPhoto(file: File, produtoNome: string): Observable<UploadResult> {
    const customFileName = `produto-${produtoNome}-${Date.now()}.${this.getFileExtension(file.name)}`;
    const renamedFile = new File([file], customFileName, { type: file.type });
    
    return this.uploadFile(renamedFile);
  }

  /**
   * 6. Validação de arquivo de imagem
   */
  validateImageFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
    // Verifica se é uma imagem
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'O arquivo deve ser uma imagem (JPG, PNG, etc.)' };
    }

    // Verifica tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `A imagem deve ter no máximo ${maxSizeMB}MB` };
    }

    // Verifica extensão
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExtension = this.getFileExtension(file.name).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return { valid: false, error: 'Formato de imagem não suportado. Use JPG, PNG, GIF ou WebP' };
    }

    return { valid: true };
  }

  /**
   * 7. Obtém extensão do arquivo
   */
  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }

  /**
   * 8. Gera preview local do arquivo antes do upload
   */
  generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Erro ao gerar preview da imagem'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * 9. Verifica se uma URL é válida (útil para carregar imagens)
   */
  isValidImageUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 10. Obtém URL com fallback
   */
  getImageUrl(url: string | null | undefined, fallback: string = '/assets/fine-logo.jpeg'): string {
    return this.isValidImageUrl(url) ? url! : fallback;
  }
}
