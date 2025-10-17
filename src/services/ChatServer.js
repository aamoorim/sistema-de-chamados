// services/ChatService.js
class ChatService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.isAuthenticated = false;
    this.currentChamadoId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.messageHandlers = [];
    this.statusHandlers = [];
    this.errorHandlers = [];
  }

  /**
   * Conecta ao WebSocket Server
   */
  connect(token) {
    return new Promise((resolve, reject) => {
      try {
        // Conectar ao WebSocket
        this.ws = new WebSocket('ws://127.0.0.1:9000');

        this.ws.onopen = () => {
          console.log('✅ WebSocket conectado');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Autenticar após conectar
          this.authenticate(token)
            .then(() => resolve())
            .catch(err => reject(err));
          
          this.notifyStatus('connected');
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          console.error('❌ Erro no WebSocket:', error);
          this.notifyError('Erro na conexão WebSocket');
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket desconectado');
          this.isConnected = false;
          this.isAuthenticated = false;
          this.notifyStatus('disconnected');
          
          // Tentar reconectar
          this.attemptReconnect(token);
        };

      } catch (error) {
        console.error('❌ Erro ao conectar:', error);
        reject(error);
      }
    });
  }

  /**
   * Autentica o usuário no WebSocket
   */
  authenticate(token) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('WebSocket não conectado'));
        return;
      }

      const authMessage = {
        type: 'auth',
        token: token
      };

      // Criar um timeout para autenticação
      const authTimeout = setTimeout(() => {
        reject(new Error('Timeout na autenticação'));
      }, 5000);

      // Listener temporário para resposta de autenticação
      const authHandler = (data) => {
        if (data.success) {
          clearTimeout(authTimeout);
          this.isAuthenticated = true;
          console.log('✅ Autenticado no WebSocket');
          resolve();
        } else if (data.erro) {
          clearTimeout(authTimeout);
          reject(new Error(data.erro));
        }
      };

      this.messageHandlers.push(authHandler);
      this.send(authMessage);

      // Remover handler após autenticação
      setTimeout(() => {
        const idx = this.messageHandlers.indexOf(authHandler);
        if (idx > -1) this.messageHandlers.splice(idx, 1);
      }, 6000);
    });
  }

  /**
   * Entra em um chamado específico
   */
  joinChamado(chamadoId) {
    return new Promise((resolve, reject) => {
      if (!this.isAuthenticated) {
        reject(new Error('Não autenticado'));
        return;
      }

      const joinMessage = {
        type: 'join',
        chamado_id: chamadoId
      };

      const joinHandler = (data) => {
        if (data.success && data.success.includes(chamadoId)) {
          this.currentChamadoId = chamadoId;
          console.log(`✅ Entrou no chamado ${chamadoId}`);
          resolve();
        } else if (data.erro) {
          reject(new Error(data.erro));
        }
      };

      this.messageHandlers.push(joinHandler);
      this.send(joinMessage);

      setTimeout(() => {
        const idx = this.messageHandlers.indexOf(joinHandler);
        if (idx > -1) this.messageHandlers.splice(idx, 1);
      }, 5000);
    });
  }

  /**
   * Envia uma mensagem via WebSocket
   */
  sendMessage(message) {
    if (!this.isAuthenticated || !this.currentChamadoId) {
      throw new Error('Não conectado ou não está em um chamado');
    }

    const msgData = {
      type: 'msg',
      message: message
    };

    this.send(msgData);
  }

  /**
   * Envia dados pelo WebSocket
   */
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('❌ WebSocket não está aberto');
    }
  }

  /**
   * Processa mensagens recebidas
   */
  handleMessage(rawData) {
    try {
      const data = JSON.parse(rawData);
      
      // Notificar todos os handlers
      this.messageHandlers.forEach(handler => handler(data));

      // Se for uma mensagem de chat
      if (data.type === 'msg') {
        this.notifyMessage(data);
      }

      // Se for um erro
      if (data.erro) {
        this.notifyError(data.erro);
      }

    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
    }
  }

  /**
   * Busca histórico de mensagens via API REST
   */
  async fetchMessageHistory(chamadoId, token) {
    try {
      const response = await fetch(`http://localhost/api-sdc/chamados/mensagens/${chamadoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar histórico');
      }

      const data = await response.json();
      return data.mensagens || [];

    } catch (error) {
      console.error('❌ Erro ao buscar histórico:', error);
      throw error;
    }
  }

  /**
   * Envia mensagem via API REST (fallback)
   */
  async sendMessageViaAPI(chamadoId, mensagem, token) {
    try {
      const response = await fetch(`http://localhost/api-sdc/chamados/mensagens/${chamadoId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensagem })
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }

      const data = await response.json();
      return data.mensagem;

    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * Registra callback para novas mensagens
   */
  onMessage(callback) {
    this.messageHandlers.push((data) => {
      if (data.type === 'msg') {
        callback(data);
      }
    });
  }

  /**
   * Registra callback para mudanças de status
   */
  onStatusChange(callback) {
    this.statusHandlers.push(callback);
  }

  /**
   * Registra callback para erros
   */
  onError(callback) {
    this.errorHandlers.push(callback);
  }

  /**
   * Notifica handlers de mensagem
   */
  notifyMessage(message) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Erro no handler de mensagem:', error);
      }
    });
  }

  /**
   * Notifica handlers de status
   */
  notifyStatus(status) {
    this.statusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('Erro no handler de status:', error);
      }
    });
  }

  /**
   * Notifica handlers de erro
   */
  notifyError(error) {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (error) {
        console.error('Erro no handler de erro:', error);
      }
    });
  }

  /**
   * Tenta reconectar
   */
  attemptReconnect(token) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Máximo de tentativas de reconexão atingido');
      this.notifyError('Não foi possível reconectar ao servidor');
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Tentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect(token).catch(err => {
        console.error('Erro na reconexão:', err);
      });
    }, this.reconnectDelay);
  }

  /**
   * Desconecta do WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.isAuthenticated = false;
    this.currentChamadoId = null;
  }

  /**
   * Limpa todos os handlers
   */
  clearHandlers() {
    this.messageHandlers = [];
    this.statusHandlers = [];
    this.errorHandlers = [];
  }

  /**
   * Retorna status da conexão
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      isAuthenticated: this.isAuthenticated,
      currentChamadoId: this.currentChamadoId
    };
  }
}

// Exportar instância única (Singleton)
const chatService = new ChatService();
export default chatService;