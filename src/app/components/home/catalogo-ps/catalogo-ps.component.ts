import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CardPsComponent } from '../../card-ps/card-ps.component';
import { Produto, Servico } from '../../../interfaces/entities.interface';
import { ServicoService } from '../../../services/servico.service';
import { ProdutoService } from '../../../services/produto.service';

@Component({
  selector: 'app-catalogo-ps',
  imports: [MatIconModule, MatButtonModule, CommonModule, CardPsComponent],
  templateUrl: './catalogo-ps.component.html',
  styleUrl: './catalogo-ps.component.scss'
})
export class CatalogoPsComponent implements OnInit {
  @ViewChild('produtosCarousel', { static: false }) produtosCarousel!: ElementRef;
  @ViewChild('servicosCarousel', { static: false }) servicosCarousel!: ElementRef;

  produtos: Produto[] = [];
  servicos: Servico[] = [];

  private currentProductIndex = 0;
  private currentServiceIndex = 0;
  private readonly cardWidth = 350;

  constructor(private servicoService: ServicoService, private produtoService: ProdutoService) {

  }

  ngOnInit(): void {
   this.servicoService.getServicos().subscribe(servicos => {
     this.servicos = servicos.filter(servico => servico.ativo);
   });
   this.produtoService.getProdutos().subscribe(produtos => {
     this.produtos = produtos.filter(produto => produto.ativo);
   });
  }

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

  get canGoNextProducts(): boolean {
    const carousel = this.produtosCarousel?.nativeElement;
    if (!carousel) return false;
    return carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth);
  }

  get canGoPreviousProducts(): boolean {
    return this.currentProductIndex > 0;
  }

  get canGoNextServices(): boolean {
    const carousel = this.servicosCarousel?.nativeElement;
    if (!carousel) return false;
    return carousel.scrollLeft < (carousel.scrollWidth - carousel.clientWidth);
  }

  get canGoPreviousServices(): boolean {
    return this.currentServiceIndex > 0;
  }
}
