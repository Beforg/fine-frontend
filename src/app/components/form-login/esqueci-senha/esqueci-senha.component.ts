import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { RecuperarSenha, ValidarCredenciais } from '../../../services/auth.service';

@Component({
  selector: 'app-esqueci-senha',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule
  ],
  templateUrl: './esqueci-senha.component.html',
  styleUrl: './esqueci-senha.component.scss'
})
export class EsqueciSenhaComponent {
    // Variáveis do modal de recuperação de senha
  @Input() showModalEsqueciSenha: boolean = false;
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() validarCredenciaisEvent: EventEmitter<ValidarCredenciais> = new EventEmitter<ValidarCredenciais>();
  @Output() alterarSenhaEvent: EventEmitter<RecuperarSenha> = new EventEmitter<RecuperarSenha>();

  @Input() senhaValidada: boolean = false;
  recuperarEmail: string = '';
  recuperarTelefone: string = '';
  novaSenha: string = '';
  confirmarNovaSenha: string = '';
  selectedCountryModal: string = '+55';
  
  countries = [
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+598', name: 'Uruguay', flag: '🇺🇾' }
  ];

  openModalEsqueciSenha(): void {
    this.showModalEsqueciSenha = true;
    this.recuperarEmail = '';
    this.recuperarTelefone = '';
    this.novaSenha = '';
    this.confirmarNovaSenha = '';
    this.selectedCountryModal = '+55';
  }

  closeModalEsqueciSenha(): void {
    this.recuperarEmail = '';
    this.recuperarTelefone = '';
    this.novaSenha = '';
    this.confirmarNovaSenha = '';
    this.selectedCountryModal = '+55';
    this.modalClosed.emit();
  }

  handleValidarCredenciais(): void {
    this.validarCredenciaisEvent.emit({
      email: this.recuperarEmail,
      telefone: this.recuperarTelefone
    });  
  }

  alterarSenha(): void {

    if (this.novaSenha !== this.confirmarNovaSenha) {
      alert('As senhas não coincidem. Por favor, tente novamente.');
      return;
    }
    // Implementar alteração de senha
    this.alterarSenhaEvent.emit({
      email: this.recuperarEmail,
      novaSenha: this.novaSenha
    });
  }

  // Métodos para o modal de recuperação de senha
  onCountryChangeModal(): void {
    this.recuperarTelefone = '';
  }

  getPhonePlaceholderModal(): string {
    return this.selectedCountryModal === '+55' 
      ? '(11) 99999-9999'
      : '99 123 456';
  }

  //OBS: CODIGO REPETIDO - MELHORAR ISSO DEPOIS (ESQUECI SENHA E EDITAR PERFIL)
  onPhoneInputModal(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (this.selectedCountryModal === '+55') {
      // Formato Brasil: (11) 99999-9999 ou (11) 9999-9999
      if (value.length <= 2) {
        formattedValue = value;
      } else if (value.length <= 6) {
        formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length <= 10) {
        formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
      } else {
        formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
      }
    } else if (this.selectedCountryModal === '+598') {
      // Formato Uruguai: 99 123 456 ou 9 1234 5678
      if (value.length <= 2) {
        formattedValue = value;
      } else if (value.length <= 5) {
        formattedValue = `${value.slice(0, 2)} ${value.slice(2)}`;
      } else if (value.length <= 7) {
        formattedValue = `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
      } else if (value.length <= 8) {
        formattedValue = `${value.slice(0, 1)} ${value.slice(1, 5)} ${value.slice(5)}`;
      } else {
        formattedValue = `${value.slice(0, 1)} ${value.slice(1, 5)} ${value.slice(5, 9)}`;
      }
    }
    
    this.recuperarTelefone = formattedValue;
    input.value = formattedValue;
  }
}
