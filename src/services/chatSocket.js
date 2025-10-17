// src/services/chatSocket.js

let socket = null;

/**
 * Conecta ao servidor WebSocket.
 * @param {string} chamadoId - ID do chamado que o usuário quer entrar.
 * @param {function} onMessage - Função chamada quando receber mensagens do servidor.
 */
export function connectWebSocket(chamadoId, onMessage) {
  const userData = localStorage.getItem("user");
  let token = null;

  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      token = parsed.token;
    } catch (err) {
      console.error("Erro ao ler user do localStorage:", err);
    }
  }

  if (!token) {
    console.error("Nenhum token JWT encontrado!");
    return;
  }

  socket = new WebSocket("ws://127.0.0.1:9000");

  socket.onopen = () => {
    console.log("✅ Conectado ao WebSocket");

    // Autenticação
    socket.send(
      JSON.stringify({
        type: "auth",
        token,
      })
    );

    // Entrar no chamado
    socket.send(
      JSON.stringify({
        type: "join",
        chamado_id: chamadoId,
      })
    );
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onMessage) onMessage(data);
  };

  socket.onclose = () => {
    console.log("❌ Desconectado do WebSocket");
  };

  socket.onerror = (err) => {
    console.error("Erro no WebSocket:", err);
  };

  return socket;
}

/**
 * Envia uma mensagem para o servidor WebSocket.
 * @param {string} message - Texto da mensagem.
 */
export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "msg",
        message,
      })
    );
  } else {
    console.error("⚠️ WebSocket não está conectado!");
  }
}

/**
 * Fecha manualmente o WebSocket.
 */
export function disconnectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
