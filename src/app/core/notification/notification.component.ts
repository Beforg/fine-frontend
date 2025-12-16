import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../enums/user-role.enum';

/**
 * Interface que corresponde ao NotificationDTO do backend
 */
export interface NotificationDTO {
  agendamentoId: number;
  clienteNome: string;
  barbeiroNome: string;
  dataHoraInicio: string; // LocalDateTime vem como string ISO do backend
  tipo: string;
  mensagem: string;
}

/**
 * Interface interna para gerenciar notificações no frontend
 */
export interface Notification {
  id: number;
  agendamentoId: number;
  clienteNome: string;
  barbeiroNome: string;
  dataHoraInicio: Date;
  tipo: string;
  mensagem: string;
  read: boolean;
  time: Date;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnDestroy {
  isOpen = false;
  notifications: Notification[] = [];
  
  audioPath: string = '/assets/sounds/notification.mp3';
  private topicSubscription: Subscription | undefined;
  private notificationIdCounter = 1;
  private notificationAudio: HTMLAudioElement | null = null;

  // Dados do usuário (pode ser injetado via AuthService depois)
  userRole: string = ''; // ou 'BARBEIRO'
  userToken: string = localStorage.getItem('authToken') || '';

  constructor(private authService: AuthService, @Optional() private webSocketService?: WebSocketService) {
    // Cria o elemento de áudio para notificações
    this.initializeNotificationSound();

  }

  ngOnInit(): void {
    console.log('🔔 Inicializando NotificationComponent');
    console.log('Token:', this.userToken ? 'Presente' : 'Ausente');
    this.userRole = this.authService.getCurrentUser()?.role || '';
    console.log('WebSocketService:', this.webSocketService ? 'Disponível' : 'Indisponível');
    
    // Carrega notificações mock iniciais
    this.loadMockNotifications();
    
    // Inicia conexão WebSocket apenas se houver token válido e serviço disponível
    if (!this.userToken) {
      console.warn('⚠️ Token não encontrado. WebSocket não será conectado.');
      return;
    }

    if (!this.webSocketService) {
      console.warn('⚠️ WebSocketService não disponível.');
      return;
    }

    try {
      console.log('🚀 Iniciando conexão WebSocket...');
      this.webSocketService.connect(this.userToken);
      
      // Aguarda um pouco para a conexão ser estabelecida antes de se inscrever
      setTimeout(() => {
        this.subscribeToNotifications();
      }, 1000);
    } catch (error) {
      console.error('❌ Erro ao conectar WebSocket:', error);
    }
  }

  /**
   * Inicializa o som de notificação
   * Usa a API de áudio do navegador para criar um beep
   */
  private initializeNotificationSound(): void {
    this.notificationAudio = new Audio();
    

    this.notificationAudio.src = this.audioPath;
    
    // Fallback: Se não encontrar o arquivo, usa um beep base64
    
    this.notificationAudio.volume = 0.5; // Volume 50%
    this.notificationAudio.load();
  }

  /**
   * Toca o som de notificação
   */
  private playNotificationSound(): void {
    if (this.notificationAudio) {
      // Reset para permitir tocar múltiplas vezes seguidas
      this.notificationAudio.currentTime = 0;
      
      this.notificationAudio.play()
        .then(() => {
          console.log('🔊 Som de notificação tocado');
        })
        .catch(error => {
          console.warn('⚠️ Não foi possível tocar o som:', error);
          // Navegador pode bloquear autoplay, usuário precisa interagir primeiro
        });
    }
  }

  private subscribeToNotifications(): void {
  if (!this.webSocketService) {
    console.error(' WebSocketService não disponível para inscrição');
    return;
  }
  
  // Define o tópico baseado na role do usuário
  let topic: string;
  
  switch(this.userRole) {
    case UserRole.ADMIN:
      topic = '/topic/agendamentos/admin';
      break;
    case UserRole.BARBEIRO:
      topic = '/topic/agendamentos/barbeiro';
      break;
    case UserRole.CLIENTE:
      topic = '/topic/agendamentos/cliente';
      break;
    default:
      console.error('Role de usuário inválida:', this.userRole);
      return;
  }

  console.log('📡 Inscrevendo no tópico:', topic);

  // Se inscreve no tópico WebSocket
  try {
    this.topicSubscription = this.webSocketService
      .watch(topic)
      .subscribe({
        next: (message) => {
          console.log('📬 Mensagem recebida no tópico:', topic);
          console.log('📄 Corpo da mensagem:', message.body);
          
          try {
            const payload = JSON.parse(message.body);
            console.log('✅ Payload parseado:', payload);
            this.addNotification(payload);
          } catch (parseError) {
            console.error('❌ Erro ao parsear mensagem:', parseError);
          }
        },
        error: (error) => {
          console.error('❌ Erro no WebSocket subscription:', error);
        },
        complete: () => {
          console.log('⚠️ WebSocket subscription completada');
        }
      });
    
    console.log('✅ Inscrição no tópico realizada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao se inscrever no tópico:', error);
  }
}
  private addNotification(payload: NotificationDTO): void {
    console.log('➕ Adicionando notificação:', payload);
    
    const newNotification: Notification = {
      id: this.notificationIdCounter++,
      agendamentoId: payload.agendamentoId,
      clienteNome: payload.clienteNome,
      barbeiroNome: payload.barbeiroNome,
      dataHoraInicio: new Date(payload.dataHoraInicio),
      tipo: payload.tipo,
      mensagem: payload.mensagem,
      read: false,
      time: new Date()
    };

    // Adiciona no início do array
    this.notifications.unshift(newNotification);
    console.log('✅ Notificação adicionada. Total:', this.notifications.length);

    // Toca o som de notificação
    this.playNotificationSound();

    // Limita a 10 notificações
    if (this.notifications.length > 10) {
      this.notifications.pop();
      console.log('🗑️ Notificação antiga removida');
    }
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get hasUnreadNotifications(): boolean {
    return this.unreadCount > 0;
  }

  toggleNotifications(): void {
    this.isOpen = !this.isOpen;
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'AGENDAMENTO_CRIADO': 'event_available',
      'AGENDAMENTO_CONFIRMADO': 'check_circle',
      'AGENDAMENTO_CANCELADO': 'event_busy',
      'AGENDAMENTO_CONCLUIDO': 'done_all',
      'LEMBRETE': 'notifications_active',
      'PROMOCAO': 'local_offer',
      'info': 'info',
      'success': 'check_circle',
      'warning': 'warning',
      'error': 'error'
    };
    return icons[type] || 'notifications';
  }

  // Mock data para testes
  private loadMockNotifications(): void {

  }

  ngOnDestroy(): void {
    // Desinscreve para evitar vazamento de memória
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }
}
