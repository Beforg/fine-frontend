import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoginForm, LoginFormData, LoginFormErrors } from '../../interfaces/login-form.interface';
import { InputFieldComponent } from '../input-field/input-field.component';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';

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
  isLoading = false;
  isSubmitted = false;
  
  // Erros de validação
  formErrors: LoginFormErrors = {};
  
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

  /**
   * Configura validação em tempo real
   */
  private setupFormValidation(): void {
    // Monitora mudanças no campo login
    this.loginForm.get('login')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.isSubmitted) {
          this.updateFieldError('login');
        }
      });

    // Monitora mudanças no campo senha
    this.loginForm.get('senha')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.isSubmitted) {
          this.updateFieldError('senha');
        }
      });
  }

  /**
   * Atualiza erro de um campo específico
   */
  private updateFieldError(fieldName: keyof LoginForm): void {
    const field = this.loginForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      this.formErrors[fieldName] = this.getFieldErrorMessage(fieldName, field.errors);
    } else {
      delete this.formErrors[fieldName];
    }
  }

  /**
   * Retorna mensagem de erro para um campo
   */
  private getFieldErrorMessage(fieldName: string, errors: any): string {
    if (errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} é obrigatório`;
    }
    
    if (errors['login']) {
      return 'E-mail deve ter um formato válido';
    }
    
    if (errors['minlength']) {
      return `${this.getFieldDisplayName(fieldName)} deve ter pelo menos ${errors['minlength'].requiredLength} caracteres`;
    }
    
    if (errors['maxlength']) {
      return `${this.getFieldDisplayName(fieldName)} deve ter no máximo ${errors['maxlength'].requiredLength} caracteres`;
    }
    
    return `${this.getFieldDisplayName(fieldName)} é inválido`;
  }

  /**
   * Retorna nome amigável do campo
   */
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: Record<string, string> = {
      login: 'E-mail',
      senha: 'Senha'
    };
    
    return fieldNames[fieldName] || fieldName;
  }

  /**
   * Getter para verificar se um campo é inválido
   */
  isFieldInvalid(fieldName: keyof LoginForm): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.errors && (field.dirty || field.touched || this.isSubmitted));
  }

  /**
   * Getter para obter erro de um campo
   */
  getFieldError(fieldName: keyof LoginForm): string {
    return this.formErrors[fieldName] || '';
  }

  /**
   * Submete o formulário
   */
  onSubmit(): void {
    this.isSubmitted = true;
    
    // Marca todos os campos como touched para mostrar erros
    this.loginForm.markAllAsTouched();
    
    // Atualiza todos os erros
    Object.keys(this.loginForm.controls).forEach(key => {
      this.updateFieldError(key as keyof LoginForm);
    });
    
    // Verifica se o formulário é válido
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      // Emite os dados do formulário
      const formData: LoginFormData = {
        login: this.loginForm.value.login!,
        senha: this.loginForm.value.senha!
      };
      
      this.formSubmit.emit(formData);
    }
  }

  /**
   * Cancela o formulário
   */
  onCancel(): void {
    this.formCancel.emit();
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
}
