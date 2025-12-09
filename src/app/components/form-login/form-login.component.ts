import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { LoginForm, LoginFormData, LoginFormErrors } from '../../interfaces/login-form.interface';
import { InputFieldComponent } from '../input-field/input-field.component';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';
import { FormUtils } from '../../utils/form-utils';

@Component({
  selector: 'app-form-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    InputFieldComponent,
    PrimaryButtonComponent
  ],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss'
})
export class FormLoginComponent implements OnInit, OnDestroy {
  // FormGroup tipado com interface customizada
  loginForm!: FormGroup<LoginForm>;
  // Controle de estado
  isLoading:boolean = false;
  isSubmitted:boolean = false;
  
  // Erros de validação
  formErrors: LoginFormErrors = {};

  // Controle de tipo de login
  loginType: 'email' | 'telefone' = 'email';
  
  // Controle de país para telefone
  selectedCountry: string = '+55';
  countries = [
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+598', name: 'Uruguai', flag: '🇺🇾' }
  ];
  
  // Controle de destroy para unsubscribe
  private destroy$ = new Subject<void>();
  
  // Eventos de saída
  @Output() formSubmit = new EventEmitter<LoginFormData>();
  @Output() formCancel = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa o formulário com validações
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      login: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.maxLength(255)
        ],
        nonNullable: true
      }),
      senha: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100)
        ],
        nonNullable: true
      })
    }) as FormGroup<LoginForm>;
  }

  /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *                           FormUtils Methods                            *
   ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Configura validação em tempo real
   */
  private setupFormValidation(): void { //
    FormUtils.setupFormValidation<LoginForm>(
      this.loginForm,
      () => this.isSubmitted,
      (fieldName) => this.updateFieldError(fieldName as keyof LoginForm),
      this.destroy$
    );
  }

  onSubmit(): void {
    FormUtils.processFormSubmission(
      this.loginForm,
      () => { this.isSubmitted = true; },
      () => this.updateAllFieldErrors(),
      () => this.getFormData(),
      (loading) => { this.isLoading = loading; },
      (data) => this.formSubmit.emit(data)
    )
  }
    
  private updateAllFieldErrors(): void {
    FormUtils.updateAllFieldErrors<LoginFormErrors>(
      this.loginForm,
      this.formErrors,
      (fieldName) => this.updateFieldError(fieldName as keyof LoginForm)
    );
  }
    
  isFieldInvalid(fieldName: keyof LoginForm): boolean {
    return FormUtils.isFieldInvalid(this.loginForm, fieldName, this.isSubmitted);
  }  

  /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
   */

  /**
   * Retorna nome amigável do campo
   */
   private updateFieldError(fieldName: keyof LoginForm): void {
    const field = this.loginForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      this.formErrors[fieldName] = FormUtils.getFieldErrorMessage(
        fieldName, 
        field.errors,
        (name) => this.getFieldDisplayName(name)

        // Sem função customizada - usa nomes padrão do FormUtils
      );
    } else {
      delete this.formErrors[fieldName];
    }
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: Record<string, string> = {
      login: 'E-mail',
      senha: 'Senha'
    };
    
    return fieldNames[fieldName] || fieldName;
  }


  /**
   * Getter para obter erro de um campo
   */
  getFieldError(fieldName: keyof LoginForm): string {
    return this.formErrors[fieldName] || '';
  }
  

  /**
   * Cancela o formulário
   */
  onCancel(): void {
    this.formCancel.emit();
  }
  


  private getFormData(): LoginFormData {
    return {
      login: this.loginForm.value.login!,
      senha: this.loginForm.value.senha!
    };
  }

  /**
   * Reseta o loading state (deve ser chamado pelo componente pai)
   */
  setLoadingState(loading: boolean): void {
    this.isLoading = loading;
  }

  /**
   * Define erro geral do formulário (ex: erro de autenticação)
   */
  setGeneralError(message: string): void {
    this.formErrors.general = message;
  }

  /**
   * Limpa todos os erros
   */
  clearErrors(): void {
    this.formErrors = {};
  }

  /**
   * Reseta o formulário
   */
  resetForm(): void {
    this.loginForm.reset();
    this.isSubmitted = false;
    this.isLoading = false;
    this.clearErrors();
  }

  /**
   * Muda o tipo de login e limpa o campo
   */
  onLoginTypeChange(): void {
    this.loginForm.patchValue({ login: '' });
  }

  /**
   * Muda o país e limpa o campo de telefone
   */
  onCountryChange(): void {
    this.loginForm.patchValue({ login: '' });
  }

  /**
   * Handler de input que aplica formatação se for telefone
   */
  onLoginInput(value: string): void {
    if (this.loginType === 'telefone') {
      const cleanValue = value.replace(/\D/g, '');
      let formattedValue = '';
      
      if (this.selectedCountry === '+55') {
        // Formato Brasil: (11) 99999-9999 ou (11) 9999-9999
        if (cleanValue.length <= 2) {
          formattedValue = cleanValue;
        } else if (cleanValue.length <= 6) {
          formattedValue = `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
        } else if (cleanValue.length <= 10) {
          formattedValue = `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 6)}-${cleanValue.slice(6)}`;
        } else {
          formattedValue = `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
        }
      } else if (this.selectedCountry === '+598') {
        // Formato Uruguai: 99 123 456 ou 9 1234 5678
        if (cleanValue.length <= 2) {
          formattedValue = cleanValue;
        } else if (cleanValue.length <= 5) {
          formattedValue = `${cleanValue.slice(0, 2)} ${cleanValue.slice(2)}`;
        } else if (cleanValue.length <= 7) {
          formattedValue = `${cleanValue.slice(0, 2)} ${cleanValue.slice(2, 5)} ${cleanValue.slice(5)}`;
        } else if (cleanValue.length <= 8) {
          formattedValue = `${cleanValue.slice(0, 1)} ${cleanValue.slice(1, 5)} ${cleanValue.slice(5)}`;
        } else {
          formattedValue = `${cleanValue.slice(0, 1)} ${cleanValue.slice(1, 5)} ${cleanValue.slice(5, 9)}`;
        }
      }
      
      if (formattedValue !== value) {
        this.loginForm.patchValue({ login: formattedValue }, { emitEvent: false });
      }
    }
  }

  /**
   * Retorna o placeholder baseado no tipo de login e país
   */
  getLoginPlaceholder(): string {
    if (this.loginType === 'email') {
      return 'Digite seu e-mail';
    }
    return this.selectedCountry === '+55' 
      ? '(11) 99999-9999'
      : '99 123 456';
  }

  /**
   * Retorna o tipo de input baseado no tipo de login
   */
  getLoginInputType(): 'email' | 'tel' | 'text' {
    return this.loginType === 'email' ? 'email' : 'tel';
  }

  /**
   * Retorna o ícone baseado no tipo de login
   */
  getLoginIcon(): string {
    return this.loginType === 'email' ? 'email' : 'phone';
  }

  /**
   * Retorna o label baseado no tipo de login
   */
  getLoginLabel(): string {
    return this.loginType === 'email' ? 'E-mail' : 'Telefone';
  }
}
