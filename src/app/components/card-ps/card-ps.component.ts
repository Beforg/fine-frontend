import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

/**
 * @class CardPsComponent
 * @description Componente de cartão individual para produto ou serviço
 * @selector app-card-ps
 */

@Component({
  selector: 'app-card-ps',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './card-ps.component.html',
  styleUrl: './card-ps.component.scss'
})
export class CardPsComponent {
  @Input() nome!: string;
  @Input() descricao!: string;
  @Input() preco!: number;
  @Input() urlImagem!: string;
  @Input() tipo: 'produto' | 'servico' = 'produto';
  @Input() tempoEstimado?: number; // Tempo estimado em minutos, aplicável apenas para serviços
  
  onCardClick(): void {
    console.log(`Card clicado: ${this.nome} (${this.tipo})`);
  }

  onImageError(event: any, tipo: string): void {
    if (tipo === 'produto') {
      event.target.src = 'assets/fine-logo.jpeg';
    } else if (tipo === 'servico') {
      event.target.src = 'assets/servico-image.webp';
    }
  }
}
