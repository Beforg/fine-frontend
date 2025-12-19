import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { PrimaryButtonComponent } from '../../components/primary-button/primary-button.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FormLoginComponent } from "../../components/form-login/form-login.component";
import { LoginFormData } from '../../interfaces/login-form.interface';
import { AuthService, RecuperarSenha, ValidarCredenciais } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EsqueciSenhaComponent } from "../../components/form-login/esqueci-senha/esqueci-senha.component";
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatIconModule, FormsModule, FooterComponent, HeaderComponent, FormLoginComponent, EsqueciSenhaComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Referência ao componente FormLogin
  @ViewChild('loginForm') formLoginComponent!: FormLoginComponent;
    

  modalEsqueciSenhaVisible: boolean = false;
  senhaValidada: boolean = false;
  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) {}

  onLoginSubmit(formData: LoginFormData): void {
    console.log('🚀 Iniciando processo de login...', formData);
    this.formLoginComponent.setLoadingState(true);
    
    // Limpar erros anteriores
    this.formLoginComponent.clearErrors();
    
    // Chamar serviço de autenticação
    this.authService.login(formData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Login bem-sucedido!');
          // Sucesso - redirecionar para dashboard
          this.router.navigate(['/home']);
        } else {
          console.log('❌ Falha no login:', response.message);
          // Erro - mostrar mensagem no formulário
          this.formLoginComponent.setGeneralError(response.message || 'Erro ao fazer login');
        }
        this.formLoginComponent.setLoadingState(false);

      },
      error: (error) => {
        console.error('💥 Erro inesperado no login:', error);
        // Erro de rede ou inesperado
        this.formLoginComponent.setGeneralError((error as HttpErrorResponse).message);
        this.formLoginComponent.setLoadingState(false);
      }
    });
  }

  abrirModalEsqueciSenha(event: boolean): void {
    this.modalEsqueciSenhaVisible = event;
  }

  fecharModalEsqueciSenha(): void {
    this.modalEsqueciSenhaVisible = false;
    this.senhaValidada = false;
  }

  onLoginCancel(): void {
    // Ação de cancelamento
    this.router.navigate(['/home']);
  }

  // Validar as credencias para poder recuperar a senha.
  validarCredenciais(event: ValidarCredenciais): void {
    this.authService.validarCredenciais(event).subscribe({
      next: (response) => {
        this.senhaValidada = response;
        this.notificationService.success('Credenciais validadas com sucesso. Você pode alterar sua senha agora.');
      },
      error: (error) => {
        this.notificationService.error('Falha ao validar credenciais: '+ error.error.message);
        this.senhaValidada = false;
        // Mostrar mensagem de erro no modal
      }
    });

  }

  alterarSenha(event: RecuperarSenha): void {

    if (event.novaSenha.length < 6) {
      this.notificationService.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    this.authService.recuperarSenha(event).subscribe({
      next: (response) => {
        this.notificationService.success('Senha alterada com sucesso. Agora você pode fazer login com a nova senha.');
        this.fecharModalEsqueciSenha();
      },
      error: (error) => {
        this.notificationService.error('Falha ao alterar senha: '+ error.error.message);
        // Mostrar mensagem de erro no modal
      }
    });
  }
  
}
