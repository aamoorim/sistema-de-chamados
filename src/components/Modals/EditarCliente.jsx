import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useClientes } from "../../context/ClientesContext";
import { useAuth } from "../../context/auth-context";
import clienteService from "../../services/clienteService";
import EditIcon from "@mui/icons-material/Edit"
import Botao from "../Button.jsx"

export function ModalEditarCliente({ isOpen, onClose, cliente, onSuccess }) {
  const { token } = useAuth();
  const { updateCliente } = useClientes();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [setor, setSetor] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const senhasNaoConferem = senha && confirmarSenha && senha !== confirmarSenha;

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome || "");
      setEmail(cliente.email || "");
      setSetor(cliente.setor || "");
      setEmpresa(cliente.empresa || "");
      setSenha("");
      setConfirmarSenha("");
      setError(null);
    }
  }, [cliente]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (senhasNaoConferem) {
      setError("As senhas não coincidem");
      return;
    }

    // Construção do payload
    const dadosAtualizados = {
      nome,
      email,
      setor,
      empresa,
      ...(senha.trim() ? { senha } : {}),
    };

    // Depuração: log do payload
    console.log("[ModalEditarCliente] Payload a ser enviado:", dadosAtualizados);

    setLoading(true);
    try {
      // Você pode fazer uso do clienteService diretamente
      const updated = await clienteService.atualizarCliente(cliente.id, dadosAtualizados);
      console.log("[ModalEditarCliente] Resposta da API:", updated);

      // Atualiza no contexto local
      if (updateCliente) {
        updateCliente(cliente.id, updated);
      }

      // Callback de sucesso para recarregar no componente pai
      if (onSuccess) {
        await onSuccess();
      }

      // Fecha o modal
      onClose();
    } catch (err) {
      console.error("[ModalEditarCliente] Erro ao atualizar cliente:", err);

      // Se for erro vindo do axios/resposta do servidor, tente extrair mensagem
      let msg = "Erro ao atualizar cliente";
      if (err.response && err.response.data) {
        // Pode conter erro de validação no back-end
        msg = err.response.data.message || JSON.stringify(err.response.data);
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "#fafafa",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          p: 3,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" mb={1}>
          Editar Cliente
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          fontSize={14}
          mb={2}
        >
          Atualize as informações do cliente
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            NOME
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Nome Completo"
            sx={{ mb: 2 }}
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
          />

          {/* Email */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            E‑MAIL
          </Typography>
          <TextField
            fullWidth
            type="email"
            variant="standard"
            placeholder="exemplo@email.com"
            sx={{ mb: 2 }}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          {/* Setor */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            SETOR
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Setor"
            sx={{ mb: 2 }}
            required
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            disabled={loading}
          />

          {/* Empresa */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            EMPRESA
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Empresa"
            sx={{ mb: 2 }}
            required
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            disabled={loading}
          />

          {/* Senha */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            SENHA (deixe vazia se não quiser alterar)
          </Typography>
          <TextField
            fullWidth
            type={mostrarSenha ? "text" : "password"}
            variant="standard"
            placeholder="Senha"
            sx={{ mb: 2 }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    disabled={loading}
                  >
                    {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirmar Senha */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            CONFIRMAR SENHA
          </Typography>
          <TextField
            fullWidth
            type={mostrarConfirmar ? "text" : "password"}
            variant="standard"
            placeholder="Confirme a senha"
            sx={{ mb: 3 }}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={loading}
            error={senhasNaoConferem}
            helperText={senhasNaoConferem ? "As senhas não coincidem" : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    disabled={loading}
                  >
                    {mostrarConfirmar ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box display="flex" justifyContent="center">
            <Botao
              type="submit"
              disabled={loading || senhasNaoConferem}
              icon={EditIcon}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Botao>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
