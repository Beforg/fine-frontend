import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { UserInfo } from '../../../interfaces/entities.interface';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from "../../primary-button/primary-button.component";
import { InputFieldComponent } from "../../input-field/input-field.component";
import { PerfilService } from '../../../services/perfil.service';
import { MatCheckbox } from "@angular/material/checkbox";
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EditarPerfil } from '../../../pages/perfil/perfil.component';

@Component({
  selector: 'app-perfil-form',
  imports: [
    MatInputModule, 
    MatCardModule, 
    MatIconModule, 
    CommonModule, 
    PrimaryButtonComponent, 
    InputFieldComponent, 
    MatCheckbox, 
    FormsModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule],
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.scss'
})
export class PerfilFormComponent {
  @Input() userInfo: UserInfo | null = null;
  @Input() userRole: string = '';
  @Input() userEmail: string = '';
  @Output() editProfile = new EventEmitter<EditarPerfil>();

  alterarSenha: boolean = false;
  alterarDados: boolean = false;
  showEditModal: boolean = false;

  // Variáveis para edição do perfil
  editNome: string = '';
  editEmail: string = '';
  editTelefone: string = '';
  editNovaSenha: string = '';
  editConfirmarSenha: string = '';

    selectedCountryModal: string = '+55';
  
  countries = [
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+598', name: 'Uruguay', flag: '🇺🇾' }
  ];

  onEditProfile() {
    // Validar campos antes de enviar
    if (!this.validarCampos()) {
      return;
    }

    const perfilData: EditarPerfil = {
      emailAtual: this.userEmail,
      nome: this.editNome,
      alterarDados: this.alterarDados,
      novoEmail: this.editEmail,
      novoTelefone: this.editTelefone,
      alterarSenha: this.alterarSenha,
      novaSenha: this.editNovaSenha
    };

    this.editProfile.emit(perfilData);
    this.fecharModalEdicao();
  }

  validarCampos(): boolean {
    // Validar nome (não vazio e mínimo 3 caracteres)
    if (!this.editNome || this.editNome.trim().length < 3) {
      alert('O nome deve ter pelo menos 3 caracteres.');
      return false;
    }

    // Validar nome (apenas letras e espaços)
    const nomeRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!nomeRegex.test(this.editNome.trim())) {
      alert('O nome deve conter apenas letras.');
      return false;
    }

    // Se alterar dados, validar e-mail e telefone
    if (this.alterarDados) {
      // Validar e-mail
      if (!this.editEmail || this.editEmail.trim() === '') {
        alert('O e-mail não pode estar vazio.');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.editEmail.trim())) {
        alert('Por favor, insira um e-mail válido.');
        return false;
      }

      // Validar telefone
      if (!this.editTelefone || this.editTelefone.trim() === '') {
        alert('O telefone não pode estar vazio.');
        return false;
      }

      // Validar tamanho mínimo do telefone (pelo menos 10 dígitos sem formatação)
      const telefoneSemFormatacao = this.editTelefone.replace(/\D/g, '');
      if (telefoneSemFormatacao.length < 8) {
        alert('Por favor, insira um telefone válido com pelo menos 10 dígitos.');
        return false;
      }
    }

    // Se alterar senha, validar campos de senha
    if (this.alterarSenha) {
      // Validar nova senha
      if (!this.editNovaSenha || this.editNovaSenha.trim() === '') {
        alert('A nova senha não pode estar vazia.');
        return false;
      }

      if (this.editNovaSenha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return false;
      }

      // Validar confirmação de senha
      if (!this.editConfirmarSenha || this.editConfirmarSenha.trim() === '') {
        alert('Por favor, confirme sua nova senha.');
        return false;
      }

      if (this.editNovaSenha !== this.editConfirmarSenha) {
        alert('As senhas não coincidem.');
        return false;
      }
    }

    return true;
  }


  onCountryChangeModal(): void {
    this.editTelefone = '';
  }

  abrirModalEdicao() {
    this.editNome = this.userInfo?.nome || '';
    this.editEmail = this.userEmail || '';
    this.editTelefone = this.userInfo?.telefone || '';
    this.editNovaSenha = '';
    this.editConfirmarSenha = '';
    this.alterarDados = false;
    this.alterarSenha = false;
    
    // Detectar o código do país com base no formato do telefone
    if (this.editTelefone && this.editTelefone.trim() !== '') {
      // Se o telefone começa com '(', é formato brasileiro (+55)
      if (this.editTelefone.trim().startsWith('(')) {
        this.selectedCountryModal = '+55';
      } else {
        // Caso contrário, é formato uruguaio (+598)
        this.selectedCountryModal = '+598';
      }
    } else {
      // Se não houver telefone, usar Brasil como padrão
      this.selectedCountryModal = '+55';
    }
    
    this.showEditModal = true;
  }

  fecharModalEdicao() {
    this.showEditModal = false;
  }


    getPhonePlaceholderModal(): string {
    return this.selectedCountryModal === '+55' 
      ? '(11) 99999-9999'
      : '99 123 456';
  }

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
    
    this.editTelefone = formattedValue;
    input.value = formattedValue;
  }

  onlyNumbersAndFormat(event: KeyboardEvent): boolean {
    const charCode = event.which || event.keyCode;
    const char = String.fromCharCode(charCode);
    
    // Permitir: números (0-9), parênteses, espaço, hífen
    const allowedChars = /[0-9()\s-]/;
    
    if (!allowedChars.test(char)) {
      event.preventDefault();
      return false;
    }
    
    return true;
  }

  isFidelidadeExpirada(data: string): boolean {
    const hoje = new Date();
    const dataFidelidade = new Date(data);
    return dataFidelidade < hoje;
  }
}
