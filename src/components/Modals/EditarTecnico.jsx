import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTecnicos } from "../../context/TecnicosContext";
import { useAuth } from "../../context/auth-context";
import EditIcon from "@mui/icons-material/Edit";
import Botao from "../Button.jsx";
import api from "../../services/api";

export function ModalEditarTecnico({ isOpen, onClose, tecnico, onSuccess }) {
  const { setTecnicos } = useTecnicos();
  const { token } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ======== Função de validação (baseada no backend PHP) ========
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
    if (tecnico) {
      setNome(tecnico.nome || "");
      setEmail(tecnico.email || "");
      setCargo(tecnico.cargo || "");
      setSenha("");
      setConfirmarSenha("");
      setError(null);
    }
  }, [tecnico]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Se o campo senha não estiver vazio, validar
    if (senha && !senhaValida) {
      setError("A senha não atende aos requisitos mínimos.");
      return;
    }

    const tecnicoAtualizado = {
      nome,
      email,
      cargo,
      ...(senha.trim() ? { senha } : {}),
    };

    setLoading(true);
    try {
      const response = await api.put(`/tecnicos/${tecnico.id}`, tecnicoAtualizado, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      setTecnicos((prev) => prev.map((t) => (t.id === data.id ? data : t)));

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao atualizar técnico");
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
          p: 4,
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
          Editar Técnico
        </Typography>
        <Typography variant="caption" color="text.secondary" fontSize={14} mb={3}>
          Atualize as informações do técnico
        </Typography>

        <form onSubmit={handleSubmit}>
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            NOME
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Nome Completo"
            sx={{ mb: 3 }}
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
          />

          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            E-MAIL
          </Typography>
          <TextField
            fullWidth
            type="email"
            variant="standard"
            placeholder="exemplo@email.com"
            sx={{ mb: 3 }}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            CARGO
          </Typography>
          <TextField
            fullWidth
            type="text"
            variant="standard"
            placeholder="Cargo do Técnico"
            sx={{ mb: 3 }}
            required
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            disabled={loading}
          />

          {/* ==================== SENHA ==================== */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            SENHA (deixe vazia caso não queira alterar)
          </Typography>
          <TextField
            fullWidth
            type={mostrarSenha ? "text" : "password"}
            variant="standard"
            placeholder="Nova Senha"
            sx={{ mb: 3 }}
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


          {/* ===== Requisitos de Senha ===== */}
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

          {/* CONFIRMAR SENHA */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            CONFIRMAR SENHA
          </Typography>
          <TextField
            fullWidth
            type={mostrarConfirmar ? "text" : "password"}
            variant="standard"
            placeholder="Confirme a Senha"
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



          {/* ======= MENSAGEM DE ERRO ======= */}
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
