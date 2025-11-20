import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from "../../components/header/header.component";
import { BarbeirosComponent } from "../../components/home/barbeiros/barbeiros.component";
import { HeroSectionComponent } from "../../components/home/hero-section/hero-section.component";
import { CatalogoPsComponent } from "../../components/home/catalogo-ps/catalogo-ps.component";
import { SobreComponent } from "../../components/home/sobre/sobre.component";

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule, FormsModule, FooterComponent, HeaderComponent, BarbeirosComponent, HeroSectionComponent, CatalogoPsComponent, SobreComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  
  // Propriedades para os campos de exemplo
  textValue: string = '';
  emailValue: string = '';
  passwordValue: string = '';
  
  // Injetar o Router no construtor
  constructor(private router: Router, private elementRef: ElementRef) {}
  
  ngAfterViewInit() {
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Optional: stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all components in page-container
    const elementsToAnimate = this.elementRef.nativeElement.querySelectorAll(
      'app-hero-section, app-barbeiros, app-catalogo-ps, app-sobre'
    );

    elementsToAnimate.forEach((element: Element) => {
      element.classList.add('scroll-reveal');
      observer.observe(element);
    });
  }
  
  // Métodos para testar o botão
  onLoginClick() {
    console.log('Navegando para login...');
    
    // Navegar para a página de login
    this.router.navigate(['/login']);
  }
  
  onSaveClick() {
    console.log('Salvando dados...');
  }
  
  onDeleteClick() {
    console.log('Excluindo item...');
  }
}
