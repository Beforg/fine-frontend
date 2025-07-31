import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  imgFooter: string = '/assets/fine-logo.jpeg';
  // Informações da barbearia
  businessInfo = {
    name: 'Barbearia Fine',
    address: 'R. Manduca Rodrigues, 524 - Centro, Sant\'Ana do Livramento - RS, 97573-560',
    phone: '(55) 97400-4740',
    developer: 'Bruno Forgiarini'
  };
  
  // Horários de funcionamento
  workingHours = [
    { days: 'Segunda - Sexta', hours: '09:00–19:00' },
    { days: 'Sábado', hours: '09:30–19:00' },
    { days: 'Domingo', hours: 'Fechado' }
  ];
  
  // Ano atual para copyright
  currentYear = new Date().getFullYear();
  
  // Método para limpar o telefone (apenas números)
  getCleanPhone(): string {
    return this.businessInfo.phone.replace(/\D/g, '');
  }
}
