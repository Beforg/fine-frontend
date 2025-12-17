import { Injectable } from '@angular/core';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends RxStomp {

  constructor() {
    super();
  }

  public connect(token: string): void {
    const stompConfig: RxStompConfig = {
      webSocketFactory: () => {
        console.log('🔌 Conectando ao WebSocket:', environment.webSocketUrl);
        return new SockJS(environment.webSocketUrl);
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (msg: string) => {
        console.log('📡 WebSocket:', new Date().toLocaleTimeString(), msg);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      // Callbacks para monitorar estado da conexão
      beforeConnect: () => {
        console.log('⏳ Tentando conectar ao WebSocket...');
      },
    };

    this.configure(stompConfig);
    
    // Monitorar estado da conexão
    this.connected$.subscribe(() => {
      console.log('✅ WebSocket conectado com sucesso!');
    });

    this.connectionState$.subscribe(state => {
      console.log('🔄 Estado da conexão WebSocket:', state);
    });

    this.stompErrors$.subscribe(error => {
      console.error('❌ Erro no WebSocket:', error);
    });

    this.activate();
  }

  public disconnect(): void {
    console.log('🔌 Desconectando WebSocket...');
    this.deactivate();
  }
}
