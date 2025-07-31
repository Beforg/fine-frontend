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
}
