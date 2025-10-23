import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  IconButton,
  Box,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { X, Minus, Maximize2, MessageCircle, Send } from "lucide-react";
import { useAuth } from "../../context/auth-context";
import chatService from "../../services/chatServer";

const DraggableChatDialog = ({ isOpen, onClose, chamado }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // ======== DRAG =========
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // ==================================
  // ======== CONEXÃO WEBSOCKET + HISTÓRICO =========
  useEffect(() => {
    if (!isOpen || !chamado?.id) return;

    let socket;

    async function initChat() {
      try {
        console.log(
          "%c[1️⃣ Iniciando chat]",
          "color: dodgerblue; font-weight: bold;",
          { chamado }
        );

        // 🟢 1. Buscar histórico antes de conectar ao WebSocket
        console.log("%c[🕓 Buscando histórico de mensagens...]", "color: gray;");
        try {
          const historico = await chatService.fetchMessageHistory(chamado.id, user?.token);
          console.log("%c[✅ Histórico carregado]", "color: green;", historico);
          setMessages(historico);
        } catch (err) {
          console.error("%c[❌ Erro ao buscar histórico]", "color: red;", err);
        }

        // 🟢 2. Conectar via WebSocket
        console.log("%c[⚙️ Conectando ao WebSocket...]", "color: dodgerblue;");
        socket = new WebSocket("ws://127.0.0.1:9000");

        socket.onopen = () => {
          console.log("%c[2️⃣ WS aberto]", "color: limegreen; font-weight: bold;");
          setIsConnected(true);
          socket.send(JSON.stringify({ type: "auth", token: user?.token }));
        };

        socket.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.success?.includes("Autenticado")) {
            socket.send(JSON.stringify({ type: "join", chamado_id: chamado.id }));
          } else if (msg.type === "msg") {
            console.log("%c[💬 Nova mensagem recebida]", "color: cyan;", msg);
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === msg.id && msg.id);
              return exists ? prev : [...prev, msg];
            });
          }
        };

        socket.onerror = (err) => {
          console.error("%c[🚨 Erro no WebSocket]", "color: red; font-weight: bold;", err);
          setIsConnected(false);
        };

        socket.onclose = () => {
          console.warn("%c[⚠️ Conexão WS encerrada]", "color: orange;");
          setIsConnected(false);
        };

        window.chatSocket = socket;
      } catch (err) {
        console.error("%c[🔥 Erro crítico ao iniciar chat]", "color: red;", err);
      }
    }

    initChat();

    return () => {
      console.log("%c[🧹 Fechando WS do chat]", "color: gray;");
      socket?.close();
    };
  }, [isOpen, chamado?.id]);

  // ======== SCROLL AUTOMÁTICO =========
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ======== ENVIO DE MENSAGEM =========
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const texto = inputMessage.trim();
    setInputMessage("");

    const agora = new Date();
    const novaMsg = {
      chamado_id: chamado.id,
      usuario_id: user?.id,
      mensagem: texto,
      criado_em: agora.toISOString(),
      time: agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };



    try {
      if (window.chatSocket && window.chatSocket.readyState === WebSocket.OPEN) {
        console.log("%c[📤 Enviando via WS]", "color: deepskyblue;");
        window.chatSocket.send(JSON.stringify({ type: "msg", message: texto }));
      } else {
        console.warn("%c[🔁 Enviando via API REST (fallback)]", "color: orange;");
        await chatService.sendMessageViaAPI(chamado.id, texto, user?.token);
      }
    } catch (err) {
      console.error("%c[❌ Erro ao enviar mensagem]", "color: red;", err);
    }
  };

  if (!isOpen) return null;

  return (
    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: 360,
        borderRadius: 2,
        overflow: "hidden",
        zIndex: 2000,
        cursor: dragging ? "grabbing" : "default",
        userSelect: "none",
      }}
    >
      {/* HEADER */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          cursor: "grab",
          background: "linear-gradient(to right, #7c3aed, #4f46e5)",
          color: "white",
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <MessageCircle size={18} />
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Chat -{" "}
              {user?.id === chamado.tecnico_id
                ? chamado.cliente_nome
                : chamado.tecnico_nome || "Cliente"}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: isConnected ? "green" : "red",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <Typography variant="caption">
                {isConnected ? "Conectado" : "Desconectado"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <IconButton
            size="small"
            onClick={() => setIsMinimized(!isMinimized)}
            sx={{ color: "white" }}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
            <X size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* CORPO */}
      {!isMinimized && (
        <>
          <Box
            sx={{
              backgroundColor: "#f3f4f6",
              height: 380,
              overflowY: "auto",
              p: 2,
            }}
          >
            <Box mb={1} display="flex" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Chamado: <strong>#{chamado?.numero || chamado?.id}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {chamado?.assunto || chamado?.titulo}
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />

            {messages.map((msg, idx) => (
              <Box
                key={idx}
                display="flex"
                justifyContent={
                  msg.usuario_id === user?.id ? "flex-end" : "flex-start"
                }
                mb={1}
              >
                <Box
                  sx={{
                    bgcolor:
                      msg.usuario_id === user?.id
                        ? "primary.main"
                        : "white",
                    color:
                      msg.usuario_id === user?.id
                        ? "white"
                        : "black",
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    maxWidth: "70%",
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">{msg.mensagem}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign:
                        msg.usuario_id === user?.id ? "right" : "left",
                      opacity: 0.7,
                      mt: 0.3,
                    }}
                  >
                    {msg.time ||
                      new Date(msg.criado_em).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </Typography>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* INPUT */}
          <Box
            sx={{
              backgroundColor: "white",
              borderTop: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1.5,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Digite sua mensagem..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              endIcon={<Send size={16} />}
              sx={{ ml: 1 }}
            >
              Enviar
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default DraggableChatDialog;
