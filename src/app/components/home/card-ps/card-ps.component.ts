import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * @class CardPsComponent
 * @description Componente de cartão para produtos ou serviços
 * @selector app-card-ps
 */

@Component({
  selector: 'app-card-ps',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './card-ps.component.html',
  styleUrl: './card-ps.component.scss'
})
export class CardPsComponent {
  @ViewChild('produtosCarousel', { static: false }) produtosCarousel!: ElementRef;
  @ViewChild('servicosCarousel', { static: false }) servicosCarousel!: ElementRef;

  private currentProductIndex = 0;
  private currentServiceIndex = 0;
  private readonly cardWidth = 350; // width + gap

  // Navegação dos Produtos
  nextProducts(): void {
    const carousel = this.produtosCarousel?.nativeElement;
    if (carousel) {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const currentScroll = carousel.scrollLeft;
      
      if (currentScroll < maxScroll) {
        this.currentProductIndex++;
        carousel.scrollTo({
          left: this.currentProductIndex * this.cardWidth,
          behavior: 'smooth'
        });
      }
    }
  }

  previousProducts(): void {
    const carousel = this.produtosCarousel?.nativeElement;
    if (carousel && this.currentProductIndex > 0) {
      this.currentProductIndex--;
      carousel.scrollTo({
        left: this.currentProductIndex * this.cardWidth,
        behavior: 'smooth'
      });
    }
  }

  // Navegação dos Serviços
  nextServices(): void {
    const carousel = this.servicosCarousel?.nativeElement;
    if (carousel) {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const currentScroll = carousel.scrollLeft;
      
      if (currentScroll < maxScroll) {
        this.currentServiceIndex++;
        carousel.scrollTo({
          left: this.currentServiceIndex * this.cardWidth,
          behavior: 'smooth'
        });
      }
    }
  }

  previousServices(): void {
    const carousel = this.servicosCarousel?.nativeElement;
    if (carousel && this.currentServiceIndex > 0) {
      this.currentServiceIndex--;
      carousel.scrollTo({
        left: this.currentServiceIndex * this.cardWidth,
        behavior: 'smooth'
      });
    }
  }
}
