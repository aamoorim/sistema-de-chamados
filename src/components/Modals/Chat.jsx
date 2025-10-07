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

const DraggableChatDialog = ({ isOpen, onClose, chamado }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá, estou com problema no pagamento.", type: "received", time: "14:30" },
    { id: 2, text: "Olá João! Vou verificar isso para você.", type: "sent", time: "14:32" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // Posição e drag
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Simula conexão
  useEffect(() => {
    if (isOpen) setTimeout(() => setIsConnected(true), 500);
  }, [isOpen]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      type: "sent",
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Entendi, vou verificar isso.",
          type: "received",
          time: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 2000);
  };

  // ======== DRAG MANUAL =========
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
              Chat - {chamado?.cliente_nome || chamado?.cliente}
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

            {messages.map((msg) => (
              <Box
                key={msg.id}
                display="flex"
                justifyContent={msg.type === "sent" ? "flex-end" : "flex-start"}
                mb={1}
              >
                <Box
                  sx={{
                    bgcolor: msg.type === "sent" ? "primary.main" : "white",
                    color: msg.type === "sent" ? "white" : "black",
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    maxWidth: "70%",
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: msg.type === "sent" ? "right" : "left",
                      opacity: 0.7,
                      mt: 0.3,
                    }}
                  >
                    {msg.time}
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
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
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
