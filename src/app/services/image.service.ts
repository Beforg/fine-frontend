import { Injectable } from '@angular/core';
import { UploadS3Service } from './upload-s3.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private uploadS3Service: UploadS3Service) { }

  /**
   * Upload de foto para barbeiro usando S3
   * @param file Arquivo de imagem
   * @param barbeiroId ID do barbeiro
   * @param isBackground Se é foto de background ou perfil
   * @returns Observable com a URL da imagem salva no S3
   */
  uploadBarbeiroPhoto(file: File, barbeiroId: number, isBackground: boolean = false): Observable<string> {
    return new Observable(observer => {
      this.uploadS3Service.uploadBarbeiroPhoto(file, barbeiroId, isBackground).subscribe({
        next: (result) => {
          if (result.success && result.publicUrl) {
            console.log(`✅ Imagem do barbeiro salva no S3: ${result.publicUrl}`);
            observer.next(result.publicUrl);
            observer.complete();
          } else {
            observer.error(new Error('Falha ao fazer upload da imagem'));
          }
        },
        error: (error) => {
          console.error('❌ Erro ao fazer upload da imagem do barbeiro:', error);
          observer.error(error);
        }
      });
    });
  }

  /**
   * Upload de foto para produto usando S3
   * @param file Arquivo de imagem
   * @param produtoId ID do produto
   * @returns Observable com a URL da imagem salva no S3
   */
  uploadProdutoPhoto(file: File, produtoNome: string): Observable<string> {
    return new Observable(observer => {
      this.uploadS3Service.uploadProdutoPhoto(file, produtoNome).subscribe({
        next: (result) => {
          if (result.success && result.publicUrl) {
            console.log(`✅ Imagem do produto salva no S3: ${result.publicUrl}`);
            observer.next(result.publicUrl);
            observer.complete();
          } else {
            observer.error(new Error('Falha ao fazer upload da imagem'));
          }
        },
        error: (error) => {
          console.error('❌ Erro ao fazer upload da imagem do produto:', error);
          observer.error(error);
        }
      });
    });
  }

  /**
   * Valida se o arquivo é uma imagem válida
   * Delega para o UploadS3Service
   */
  validateImageFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
    // Verificar tamanho do arquivo
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, error: `Arquivo deve ter no máximo ${maxSizeMB}MB.` };
    }

    // Verificar tipos permitidos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Apenas arquivos JPEG, PNG e WebP são permitidos.' };
    }

    return { valid: true };
  }

  /**
   * Gera preview local da imagem antes do upload
   */
  generatePreview(file: File): Promise<string> {
    return this.uploadS3Service.generatePreview(file);
  }

  /**
   * Obtém URL da imagem com fallback
   */
  getImageUrl(url: string | null | undefined, fallback: string = '/assets/fine-logo.jpeg'): string {
    return this.uploadS3Service.getImageUrl(url, fallback);
  }

  /**
   * Verifica se uma URL é válida
   */
  isValidImageUrl(url: string | null | undefined): boolean {
    return this.uploadS3Service.isValidImageUrl(url);
  }
}
