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
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatIconModule, FormsModule, FooterComponent, HeaderComponent, FormLoginComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Referência ao componente FormLogin
  @ViewChild('loginForm') formLoginComponent!: FormLoginComponent;
  

  constructor(private router: Router, private authService: AuthService) {}

  async onLoginSubmit(formData: LoginFormData): Promise<void> {
    console.log('🚀 Iniciando processo de login...', formData);
    this.formLoginComponent.setLoadingState(true);
    try {
      // Limpar erros anteriores
      this.formLoginComponent.clearErrors();
      
      // Chamar serviço de autenticação
      const response = await this.authService.login(formData);
      
      if (response.success) {
        console.log('✅ Login bem-sucedido!');
        // Sucesso - redirecionar para dashboard
        this.router.navigate(['/dashboard']);
      } else {
        console.log('❌ Falha no login:', response.message);
        // Erro - mostrar mensagem no formulário
        this.formLoginComponent.setGeneralError(response.message || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('💥 Erro inesperado no login:', error);
      // Erro de rede ou inesperado
      this.formLoginComponent.setGeneralError('Erro de conexão. Verifique sua internet.');
    } finally {
      // Parar loading no formulário
      this.formLoginComponent.setLoadingState(false);
    }
  }

  onLoginCancel(): void {
    // Ação de cancelamento
    this.router.navigate(['/home']);
  }
}
