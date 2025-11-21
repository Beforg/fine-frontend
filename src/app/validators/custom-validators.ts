import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores customizados para formulários
 */
export class CustomValidators {

  /**
   * Validador para confirmação de senha
   * Verifica se as senhas coincidem
   */
  static passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get(passwordField)?.value;
      const confirmPassword = form.get(confirmPasswordField)?.value;

      if (!password || !confirmPassword) {
        return null; // Deixa os validadores required cuidarem disso
      }

      if (password !== confirmPassword) {
        // Adiciona erro no campo de confirmação
        const confirmField = form.get(confirmPasswordField);
        if (confirmField) {
          confirmField.setErrors({ passwordMismatch: true });
        }
        return { passwordMismatch: true };
      } else {
        // Remove erro de passwordMismatch se as senhas coincidem
        const confirmField = form.get(confirmPasswordField);
        if (confirmField?.errors?.['passwordMismatch']) {
          delete confirmField.errors['passwordMismatch'];
          if (Object.keys(confirmField.errors).length === 0) {
            confirmField.setErrors(null);
          }
        }
      }

      return null;
    };
  }

  /**
   * Validador para telefone brasileiro e uruguaio
   * Brasil: (11) 99999-9999, 11 999999999, +55 11 999999999
   * Uruguai: 099 123 456, +598 99 123 456
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      // Remove tudo que não é número
      const phoneNumbers = control.value.replace(/\D/g, '');
      
      // Brasil: 10-11 dígitos (DDD + número) ou 13 dígitos (+55)
      // Uruguai: 8 dígitos (celular) ou 11 dígitos (+598)
      const isBrazilian = /^(\d{10,11}|\d{13})$/.test(phoneNumbers);
      const isUruguayan = /^(\d{8}|\d{11})$/.test(phoneNumbers);
      
      return (isBrazilian || isUruguayan) ? null : { phone: true };
    };
  }

  /**
   * Validador para nome completo
   * Verifica se tem pelo menos nome e sobrenome
   */
  static fullName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const nameParts = control.value.trim().split(' ').filter((part: string) => part.length > 0);
      
      return nameParts.length >= 2 ? null : { fullName: true };
    };
  }

  /**
   * Validador para senha forte
   * Deve ter pelo menos: 1 maiúscula, 1 minúscula, 1 número
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(control.value);
      const hasLowerCase = /[a-z]/.test(control.value);
      const hasNumber = /\d/.test(control.value);
      const hasMinLength = control.value.length >= 8;

      const errors: any = {};

      if (!hasUpperCase) errors.needsUpperCase = true;
      if (!hasLowerCase) errors.needsLowerCase = true;
      if (!hasNumber) errors.needsNumber = true;
      if (!hasMinLength) errors.needsMinLength = true;

      return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
    };
  }
}
