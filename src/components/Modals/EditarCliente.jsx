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
import EditIcon from "@mui/icons-material/Edit";
import Botao from "../Button.jsx";

export function ModalEditarCliente({ isOpen, onClose, cliente, onSuccess }) {
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

  // Função de validação com base no backend
  const validarSenha = (senha) => {
    return {
      comprimento: senha.length >= 8,
      espacos: !/\s/.test(senha),
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /[0-9]/.test(senha),
      especial: /[\W_]/.test(senha),
    };
  };

  const validacoes = validarSenha(senha);
  const senhasCoincidem = senha === confirmarSenha && senha.length > 0;

  const senhaValida =
    validacoes.comprimento &&
    validacoes.espacos &&
    validacoes.maiuscula &&
    validacoes.minuscula &&
    validacoes.numero &&
    validacoes.especial &&
    senhasCoincidem;

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

    if (senha && !senhaValida) {
      setError("A senha não atende aos requisitos mínimos.");
      return;
    }

    const dadosAtualizados = {
      nome,
      email,
      setor,
      empresa,
      ...(senha.trim() ? { senha } : {}),
    };

    setLoading(true);
    try {
      const updated = await clienteService.atualizarCliente(cliente.id, dadosAtualizados);
      if (updateCliente) updateCliente(cliente.id, updated);
      if (onSuccess) await onSuccess();
      onClose();
    } catch (err) {
      let msg = "Erro ao atualizar cliente";
      if (err.response && err.response.data) {
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
          maxWidth: 700,
          minWidth: 300,
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
        <Typography variant="caption" color="text.secondary" fontSize={14} mb={2}>
          Atualize as informações do cliente
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nome"
            variant="standard"
            sx={{ mb: 2 }}
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
          />

          <TextField
            fullWidth
            type="email"
            label="E-mail"
            variant="standard"
            sx={{ mb: 2 }}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Setor"
            variant="standard"
            sx={{ mb: 2 }}
            required
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Empresa"
            variant="standard"
            sx={{ mb: 2 }}
            required
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            disabled={loading}
          />

          {/* Senha */}
          <TextField
            fullWidth
            type={mostrarSenha ? "text" : "password"}
            label="Nova Senha (deixe vazia se não quiser alterar)"
            variant="standard"
            sx={{ mb: 2 }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setMostrarSenha(!mostrarSenha)}>
                    {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />




          {/* Lista de requisitos da senha */}
          {senha && (
            <Box sx={{ mb: 2, mt: -1 }}>
              <Typography
                variant="body2"
                color={validacoes.comprimento ? "success.main" : "error"}
              >
                • Mínimo 8 caracteres
              </Typography>
              <Typography
                variant="body2"
                color={validacoes.maiuscula ? "success.main" : "error"}
              >
                • Pelo menos 1 letra maiúscula
              </Typography>
              <Typography
                variant="body2"
                color={validacoes.minuscula ? "success.main" : "error"}
              >
                • Pelo menos 1 letra minúscula
              </Typography>
              <Typography
                variant="body2"
                color={validacoes.numero ? "success.main" : "error"}
              >
                • Pelo menos 1 número
              </Typography>
              <Typography
                variant="body2"
                color={validacoes.especial ? "success.main" : "error"}
              >
                • Pelo menos 1 caractere especial
              </Typography>
              <Typography
                variant="body2"
                color={senhasCoincidem ? "success.main" : "error"}
              >
                • As senhas coincidem
              </Typography>
            </Box>
          )}


          {/* Confirmar Senha */}
          <TextField
            fullWidth
            type={mostrarConfirmar ? "text" : "password"}
            label="Confirmar Nova Senha"
            variant="standard"
            sx={{ mb: 2 }}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={loading}
            error={senha && confirmarSenha && !senhasCoincidem}
            helperText={
              senha && confirmarSenha && !senhasCoincidem
                ? "As senhas não coincidem"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
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
              disabled={loading || (senha && !senhaValida)}
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
