import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { FormRegisterComponent } from '../../components/form-register/form-register.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { RegisterFormData } from '../../interfaces/register-form.interface';

@Component({
  selector: 'app-register',
  imports: [HeaderComponent, FooterComponent, FormRegisterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild('registerForm') formRegisterComponent!: FormRegisterComponent;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  async onRegisterSubmit(formData: RegisterFormData): Promise<void> {
    console.log("🚀 Iniciando processo de registro...", formData);
    this.formRegisterComponent.setLoadingState(true);
    try {
      // Limpar erros anteriores
      this.formRegisterComponent.clearErrors();
      
      // Chamar serviço de cadastro
      const response = await this.authService.register(formData);
      
      if (response.httpStatus == "CREATED") {
        console.log("✅ Cadastro realizado com sucesso");
        
        // 🎉 NOTIFICAÇÃO DE SUCESSO
        this.notificationService.accountCreated(formData.nome);
        
        // Aguardar um pouco para o usuário ver a notificação, depois redirecionar
        setTimeout(() => {
          console.log("� Redirecionando para login após registro...");
          this.router.navigate(['/login']);
        }, 3000);
        
      } else {
        console.log("❌ Falha no cadastro:", response.message);
        // O erro já será exibido pelo setGeneralError que já tem notificação
        this.formRegisterComponent.setGeneralError(
          response.message || 'Erro ao criar conta. Verifique os dados.'
        );
      }
      
    } catch (error) {
      console.error("💥 Erro inesperado no registro:", error);
      
      // 🔌 NOTIFICAÇÃO DE ERRO DE CONEXÃO
      this.formRegisterComponent.showConnectionError();
      this.formRegisterComponent.setGeneralError('Erro de conexão. Verifique sua internet.');
      
    } finally {
      this.formRegisterComponent.setLoadingState(false);
    }
  }

  onRegisterCancel(): void {
    this.router.navigate(['/login']);
  }
}
