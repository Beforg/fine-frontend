import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/**
 * Utilitário para manipulação de formulários
 * Lida com funcionalidades comuns em formulários reativos
 */
export class FormUtils {

  private static readonly FIELD_DISPLAY_NAMES: Record<string, string> = {
    login: 'Login',
    email: 'E-mail',
    senha: 'Senha',
    confirmarSenha: 'Confirmação de senha',
    
    // Campos de cadastro
    nome: 'Nome completo',
    telefone: 'Telefone',
    cpf: 'CPF',
    
    // Campos de endereço
    endereco: 'Endereço',
    cidade: 'Cidade',
    estado: 'Estado',
    cep: 'CEP',
    
    // Campos gerais
    observacoes: 'Observações',
    dataNascimento: 'Data de nascimento'
  }

  /**
   * Retorna nome amigável do campo
   * @param fieldName Nome do campo técnico
   * @param customNames Nomes customizados específicos do formulário (opcional)
   * @returns Nome amigável do campo
   */
  static getFieldDisplayName(fieldName: string, customNames?: Record<string, string>): string {
    // Primeiro verifica nomes customizados, depois os padrão
    if (customNames && customNames[fieldName]) {
      return customNames[fieldName];
    }
    
    return FormUtils.FIELD_DISPLAY_NAMES[fieldName] || fieldName;
  }
  /**
   * Configura validação em tempo real para todos os campos do formulário
   */
  static setupFormValidation<T>(
    form: any, 
    isSubmitted: () => boolean, 
    updateFieldError: (fieldName: string) => void,
    destroy$: Subject<void>
  ): void {
    Object.keys(form.controls as {[key: string]: AbstractControl}).forEach(fieldName => {
      const field = form.get(fieldName);
      
      // Escuta mudanças de valor
      field?.valueChanges
        .pipe(takeUntil(destroy$))
        .subscribe(() => {
          updateFieldError(fieldName);
        });
      
      // Escuta mudanças de status (touched, dirty, etc.)
      field?.statusChanges
        .pipe(takeUntil(destroy$))
        .subscribe(() => {
          updateFieldError(fieldName);
        });
    });
  }

  /**
   * Gera mensagem de erro padronizada para um campo
   * @param fieldName Nome do campo
   * @param errors Objeto de erros do campo
   * @param displayNameFn Função para obter nome amigável (opcional)
   * @returns Mensagem de erro formatada
   */
  static getFieldErrorMessage(
    fieldName: string, 
    errors: any, 
    displayNameFn?: (name: string) => string
  ): string {
    // Usa função customizada ou função padrão
    const getDisplayName = displayNameFn || ((name: string) => FormUtils.getFieldDisplayName(name));
    const fieldDisplayName = getDisplayName(fieldName);

    // Erros obrigatórios
    if (errors['required']) {
      return `${fieldDisplayName} é obrigatório`;
    }

    // Erros de formato
    if (errors['email']) {
      return `${fieldDisplayName} deve ter um formato válido`;
    }

    if (errors['phone']) {
      return `${fieldDisplayName} deve ter um formato válido (brasileiro ou uruguaio)`;
    }

    // Erros de tamanho
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${fieldDisplayName} deve ter pelo menos ${requiredLength} caracteres`;
    }

    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `${fieldDisplayName} deve ter no máximo ${maxLength} caracteres`;
    }

    // Erros customizados
    if (errors['fullName']) {
      return `${fieldDisplayName} deve conter nome e sobrenome`;
    }

    if (errors['strongPassword']) {
      const details = errors['strongPassword'];
      const requirements = [];
      
      if (details.needsUpperCase) requirements.push('uma letra maiúscula');
      if (details.needsLowerCase) requirements.push('uma letra minúscula');
      if (details.needsNumber) requirements.push('um número');
      if (details.needsMinLength) requirements.push('pelo menos 8 caracteres');
      
      return `${fieldDisplayName} deve conter: ${requirements.join(', ')}`;
    }

    if (errors['passwordMismatch']) {
      return `${fieldDisplayName} não confere com a senha`;
    }

    // Erro genérico
    return `${fieldDisplayName} é inválido`;
  }

  /**
   * Verifica se um campo é inválido
   */
  static isFieldInvalid(form: any, fieldName: string, isSubmitted: boolean): boolean {
    const field = form.get(fieldName);
    return !!(field?.errors && (field.dirty || field.touched || isSubmitted));
  }

  /**
   * Atualiza todos os erros do formulário
   */
  static updateAllFieldErrors<T>(
    form: any, 
    formErrors: T, 
    updateFieldError: (fieldName: string) => void
  ): void {
    Object.keys(form.controls as {[key: string]: AbstractControl}).forEach(key => {
      updateFieldError(key);
    });
  }

  /**
   * Processa submissão do formulário
   */
  static processFormSubmission<TFormData>(
    form: any,
    markAsSubmitted: () => void,
    updateAllErrors: () => void,
    getFormData: () => TFormData,
    setLoading: (loading: boolean) => void,
    onSubmit: (data: TFormData) => void
  ): void {
    markAsSubmitted();
    
    // Marca todos os campos como touched para mostrar erros
    form.markAllAsTouched();
    
    // Atualiza todos os erros
    updateAllErrors();
    
    // Verifica se o formulário é válido
    if (form.valid) {
      setLoading(true);
      
      // Emite os dados do formulário
      const formData = getFormData();
      onSubmit(formData);
    }
  }
}
