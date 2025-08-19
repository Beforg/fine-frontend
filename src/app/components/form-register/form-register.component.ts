import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RegisterForm, RegisterFormData, RegisterFormErrors } from '../../interfaces/register-form.interface';
import { InputFieldComponent } from '../input-field/input-field.component';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';

import { FormUtils } from '../../utils/form-utils';
import { CustomValidators } from '../../validators/custom-validators';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-form-register',
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
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.scss'
})
export class FormRegisterComponent implements OnInit, OnDestroy {

  // FormGroup tipado
  registerForm!: FormGroup<RegisterForm>;

  // Controle de estado
  isLoading = false;
  isSubmitted = false;

  // Erros de validação
  formErrors: RegisterFormErrors = {};

  // Controle de destroy para unsubscribe
  private destroy$ = new Subject<void>();

  // Eventos de saída
  @Output() formSubmit = new EventEmitter<RegisterFormData>();
  @Output() formCancel = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

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
    this.registerForm = this.fb.group({
      nome: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          CustomValidators.fullName() // Validação para nome completo
        ],
        nonNullable: true
      }),
      email: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(255)
        ],
        nonNullable: true
      }),
      telefone: this.fb.control('', {
        validators: [
          Validators.required,
          CustomValidators.phone() // Validação para telefone brasileiro e uruguaio
        ],
        nonNullable: true
      }),
      senha: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          CustomValidators.strongPassword() // Validação para senha forte
          
        ],
        nonNullable: true
      }),
      confirmarSenha: this.fb.control('', {
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100)
        ],
        nonNullable: true
      })
    }, {
      // Validador a nível de formulário para confirmação de senha
      validators: CustomValidators.passwordMatch('senha', 'confirmarSenha')
    }) as FormGroup<RegisterForm>;
  }


  /**
   * Atualiza erro de um campo específico
   */
  private updateFieldError(fieldName: keyof RegisterForm): void {
    const field = this.registerForm.get(fieldName);
    
    // Mostrar erro se: campo tem erro E (foi tocado OU formulário foi submetido)
    if (field?.errors && (field.touched || this.isSubmitted)) {
      this.formErrors[fieldName] = FormUtils.getFieldErrorMessage(
        fieldName, 
        field.errors
      );
    } else {
      delete this.formErrors[fieldName];
    }
  }

  /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *                           FormUtils Methods                            *
   ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Getter para verificar se um campo é inválido
   */
  isFieldInvalid(fieldName: keyof RegisterForm): boolean {
    return FormUtils.isFieldInvalid(this.registerForm, fieldName, this.isSubmitted);
  }

    /**
   * Submete o formulário usando FormUtils
   */
  onSubmit(): void {
    FormUtils.processFormSubmission(
      this.registerForm,
      () => { this.isSubmitted = true; },
      () => this.updateAllFieldErrors(),
      () => this.getFormData(),
      (loading) => { this.isLoading = loading; },
      (data) => this.formSubmit.emit(data)
    );
  }

  /**
   * Configura validação em tempo real usando FormUtils
   */
  private setupFormValidation(): void {
    FormUtils.setupFormValidation(
      this.registerForm,
      () => this.isSubmitted,
      (fieldName) => this.updateFieldError(fieldName as keyof RegisterForm),
      this.destroy$
    );
  }


  /**
   * Atualiza todos os erros do formulário
   */
  private updateAllFieldErrors(): void {
    FormUtils.updateAllFieldErrors(
      this.registerForm,
      this.formErrors,
      (fieldName) => this.updateFieldError(fieldName as keyof RegisterForm)
    );
  }

  /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
   * Getter para obter erro de um campo
   */
  getFieldError(fieldName: keyof RegisterForm): string {
    return this.formErrors[fieldName] || '';
  }

  /**
   * Obtém dados do formulário para envio
   */
  private getFormData(): RegisterFormData {
    return {
      nome: this.registerForm.value.nome!,
      email: this.registerForm.value.email!,
      telefone: this.registerForm.value.telefone!,
      senha: this.registerForm.value.senha!,
      confirmarSenha: this.registerForm.value.confirmarSenha!
    };
  }



  /**
   * Cancela o formulário
   */
  onCancel(): void {
    // Notificação de cancelamento
    this.formCancel.emit();
  }

  /**
   * Reseta o loading state (deve ser chamado pelo componente pai)
   */
  setLoadingState(loading: boolean): void {
    this.isLoading = loading;
  }

  /**
   * Define erro geral do formulário (ex: erro de cadastro)
   */
  setGeneralError(message: string): void {
    this.formErrors.general = message;
    // Exibe notificação de erro
    this.notificationService.error(message);
  }

  /**
   * Limpa todos os erros
   */
  clearErrors(): void {
    this.formErrors = {};
  }

  /**
   * Exibe notificação de sucesso no cadastro
   */
  showSuccessNotification(userName: string): void {
    this.notificationService.accountCreated(userName);
  }

  /**
   * Exibe notificação de erro de conexão
   */
  showConnectionError(): void {
    this.notificationService.connectionError();
  }

  /**
   * Reseta o formulário
   */
  resetForm(): void {
    this.registerForm.reset();
    this.isSubmitted = false;
    this.isLoading = false;
    this.clearErrors();
  }

  /**
   * Método de debug para verificar validações
   */
}
