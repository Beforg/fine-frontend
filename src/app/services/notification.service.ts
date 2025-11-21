import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';

/**
 * Tipos de notificação disponíveis
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Configuração personalizada para notificações
 */
export interface NotificationConfig {
  duration?: number;
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
  action?: string;
  panelClass?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Exibe notificação de sucesso
   */
  success(message: string, config?: NotificationConfig): MatSnackBarRef<any> {
    return this.show(message, 'success', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['notification-success'],
      action: 'Fechar',
      ...config
    });
  }

  /**
   * Exibe notificação de erro
   */
  error(message: string, config?: NotificationConfig): MatSnackBarRef<any> {
    return this.show(message, 'error', {
      duration: 6000, // Erros ficam mais tempo na tela
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['notification-error'],
      action: 'Fechar',
      ...config
    });
  }

  /**
   * Exibe notificação de aviso
   */
  warning(message: string, config?: NotificationConfig): MatSnackBarRef<any> {
    return this.show(message, 'warning', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['notification-warning'],
      action: 'OK',
      ...config
    });
  }

  /**
   * Exibe notificação informativa
   */
  info(message: string, config?: NotificationConfig): MatSnackBarRef<any> {
    return this.show(message, 'info', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['notification-info'],
      action: 'OK',
      ...config
    });
  }

  /**
   * Método privado para exibir notificação
   */
  private show(
    message: string, 
    type: NotificationType, 
    config: NotificationConfig
  ): MatSnackBarRef<any> {
    const snackBarConfig: MatSnackBarConfig = {
      duration: config.duration,
      horizontalPosition: config.horizontalPosition,
      verticalPosition: config.verticalPosition,
      panelClass: config.panelClass
    };

    return this.snackBar.open(message, config.action, snackBarConfig);
  }

  /**
   * Fecha todas as notificações abertas
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }

  /**
   * Notificação de cadastro bem-sucedido
   */
  accountCreated(name: string): MatSnackBarRef<any> {
    return this.success(`Bem-vindo, ${name}! Sua conta foi criada com sucesso.`, {
      duration: 5000,
      action: 'Continuar'
    });
  }

  /**
   * Notificação de login bem-sucedido
   */
  loginSuccess(name: string): MatSnackBarRef<any> {
    return this.success(`Olá, ${name}! Login realizado com sucesso.`, {
      duration: 3000
    });
  }

  /**
   * Notificação de erro de conexão
   */
  connectionError(): MatSnackBarRef<any> {
    return this.error('Erro de conexão. Verifique sua internet e tente novamente.', {
      duration: 7000,
      action: 'Tentar novamente'
    });
  }

  /**
   * Notificação de erro de validação
   */
  validationError(message?: string): MatSnackBarRef<any> {
    const defaultMessage = 'Por favor, verifique os dados informados.';
    return this.warning(message || defaultMessage, {
      duration: 5000
    });
  }

  /**
   * Notificação para operações genéricas
   */
  operationComplete(operation: string): MatSnackBarRef<any> {
    return this.success(`${operation} realizada com sucesso!`);
  }

  /**
   * Notificação de cancelamento
   */
  operationCanceled(operation: string): MatSnackBarRef<any> {
    return this.info(`${operation} cancelada.`, {
      duration: 3000
    });
  }
}
