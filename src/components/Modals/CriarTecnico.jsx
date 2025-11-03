import React, { useState } from "react";
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
import Botao from "../Button.jsx";
import { Plus } from "lucide-react";

export function ModalCriarTecnico({ isOpen, onClose }) {
  const { addTecnico } = useTecnicos();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== validador (mesmo do backend) =====
  const validarSenha = (s) => ({
    comprimento: s.length >= 8,
    espacos: !/\s/.test(s),
    maiuscula: /[A-Z]/.test(s),
    minuscula: /[a-z]/.test(s),
    numero: /[0-9]/.test(s),
    especial: /[\W_]/.test(s),
  });

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

  // permite submeter se senha vazia (gera no backend) OU senhaValida === true
  const podeSubmeter = !loading && (senha.trim() === "" || senhaValida);

  const senhasNaoConferem = senha && confirmarSenha && senha !== confirmarSenha;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 300,
    maxWidth: 700,
    bgcolor: "#fafafa",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    p: 4,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (senhasNaoConferem) {
      setError("As senhas não coincidem");
      return;
    }

    if (senha.trim() && !senhaValida) {
      setError("A senha não atende aos requisitos mínimos.");
      return;
    }

    if (!nome.trim() || !email.trim() || !cargo.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      // envia senha somente se preenchida
      await addTecnico({
        nome: nome.trim(),
        email: email.trim(),
        cargo: cargo.trim(),
        ...(senha.trim() ? { senha: senha.trim() } : {}),
      });

      // Limpa o formulário
      setNome("");
      setEmail("");
      setCargo("");
      setSenha("");
      setConfirmarSenha("");
      setError(null);

      onClose();
    } catch (err) {
      console.error("Erro ao criar técnico:", err);
      setError(err?.response?.data?.message || err?.message || "Erro ao criar técnico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        if (!loading) onClose();
      }}
    >
      <Box sx={style}>
        <IconButton
          onClick={() => {
            if (!loading) onClose();
          }}
          sx={{ position: "absolute", right: 12, top: 12 }}
          disabled={loading}
          aria-label="Fechar modal"
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Dados Pessoais
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          fontSize={14}
          sx={{ mb: 3 }}
        >
          Defina as informações do perfil do técnico
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
            sx={{ mb: 3 }}
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
          />

          {/* E-mail */}
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

          {/* Cargo */}
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

          {/* Senha */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            SENHA
          </Typography>
          <TextField
            fullWidth
            type={showSenha ? "text" : "password"}
            variant="standard"
            placeholder="Senha"
            sx={{ mb: 3 }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowSenha(!showSenha)}
                    edge="end"
                    disabled={loading}
                    aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showSenha ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />


          {/* Requisitos da senha em tempo real (aparece somente se usuário digitou algo em senha) */}
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
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            CONFIRMAR SENHA
          </Typography>
          <TextField
            fullWidth
            type={showConfirmarSenha ? "text" : "password"}
            variant="standard"
            placeholder="Confirme a senha"
            sx={{ mb: 2 }}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={loading}
            error={senhasNaoConferem}
            helperText={senhasNaoConferem ? "As senhas não coincidem" : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    edge="end"
                    disabled={loading}
                    aria-label={showConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showConfirmarSenha ? <VisibilityOff /> : <Visibility />}
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
            <Botao type="submit" disabled={!podeSubmeter} icon={Plus}>
              {loading ? "Criando..." : "Criar Técnico"}
            </Botao>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
