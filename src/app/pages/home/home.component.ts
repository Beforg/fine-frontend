import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from "../../components/header/header.component";
import { BarbeirosComponent } from "../../components/home/barbeiros/barbeiros.component";
import { HeroSectionComponent } from "../../components/home/hero-section/hero-section.component";
import { CardPsComponent } from "../../components/home/card-ps/card-ps.component";

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule, FormsModule, FooterComponent, HeaderComponent, BarbeirosComponent, HeroSectionComponent, CardPsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  // Propriedades para os campos de exemplo
  textValue: string = '';
  emailValue: string = '';
  passwordValue: string = '';
  
  // Injetar o Router no construtor
  constructor(private router: Router) {}
  
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
