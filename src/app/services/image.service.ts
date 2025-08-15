import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  /**
   * Upload de foto para barbeiro
   * @param file Arquivo de imagem
   * @param barbeiroId ID do barbeiro
   * @param isBackground Se é foto de background ou perfil
   * @returns URL da imagem salva
   */
  uploadBarbeiroPhoto(file: File, barbeiroId: number, isBackground: boolean = false): string {
    try {
      // Simular o salvamento da imagem
      const fileName = isBackground ? `bg${barbeiroId}.png` : `${barbeiroId}.png`;
      const urlPath = `/assets/tmp/barbeiro/${fileName}`;
      
      // Aqui você implementaria a lógica real de salvamento
      // Por exemplo, usando FileReader para converter para base64 e salvar
      console.log(`📸 Salvando imagem do barbeiro: ${file.name} -> ${urlPath}`);
      
      // Simular delay de processamento
      setTimeout(() => {
        console.log(`✅ Imagem salva com sucesso: ${urlPath}`);
      }, 1000);
      
      return urlPath;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem do barbeiro:', error);
      throw error;
    }
  }

  /**
   * Upload de foto para produto
   * @param file Arquivo de imagem
   * @param produtoId ID do produto
   * @returns URL da imagem salva
   */
  uploadProdutoPhoto(file: File, produtoId: number): string {
    try {
      const fileName = `${produtoId}.png`;
      const urlPath = `assets/tmp/produto/${fileName}`;
      
      console.log(`📸 Salvando imagem do produto: ${file.name} -> ${urlPath}`);
      
      // Simular delay de processamento
      setTimeout(() => {
        console.log(`✅ Imagem salva com sucesso: ${urlPath}`);
      }, 1000);
      
      return urlPath;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem do produto:', error);
      throw error;
    }
  }

  /**
   * Método genérico de upload (mantido para compatibilidade)
   */
  uploadPhoto(file: File): string {
    // Lógica genérica para upload
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    return `/assets/tmp/generic/${fileName}`;
  }

  /**
   * Remove foto do barbeiro
   */
  removeBarbeiroPhoto(barbeiroId: number, isBackground: boolean = false): void {
    const fileName = isBackground ? `bg${barbeiroId}.png` : `${barbeiroId}.png`;
    const urlPath = `/assets/tmp/barbeiro/${fileName}`;
    
    console.log(`🗑️ Removendo imagem do barbeiro: ${urlPath}`);
    // Implementar lógica de remoção real
  }

  /**
   * Remove foto do produto
   */
  removeProdutoPhoto(produtoId: number): void {
    const fileName = `${produtoId}.png`;
    const urlPath = `/assets/tmp/produto/${fileName}`;
    
    console.log(`🗑️ Removendo imagem do produto: ${urlPath}`);
    // Implementar lógica de remoção real
  }

  removePhoto(fileName: string): void {
    // Lógica para remover a foto
    console.log(`🗑️ Removendo foto: ${fileName}`);
  }

  /**
   * Valida se o arquivo é uma imagem válida
   */
  validateImageFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
    // Verificar se é imagem
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Arquivo deve ser uma imagem.' };
    }

    // Verificar tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `Arquivo deve ter no máximo ${maxSizeMB}MB.` };
    }

    // Verificar tipos permitidos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Apenas arquivos JPEG, PNG e WebP são permitidos.' };
    }

    return { valid: true };
  }
}
