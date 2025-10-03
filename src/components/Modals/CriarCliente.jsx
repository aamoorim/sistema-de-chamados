import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Fade,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useClientes } from "../../context/ClientesContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function ModalCriarCliente({ isOpen, onClose, onCreateSuccess }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#fafafa",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    p: 4,
  };

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [setor, setSetor] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const { addCliente } = useClientes();
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState(null);

  const senhasNaoConferem = senha && confirmarSenha && senha !== confirmarSenha;

  // Controla se o modal está fechando para aguardar animação antes de chamar onCreateSuccess
  const [isClosing, setIsClosing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (senhasNaoConferem) {
      setError("As senhas não coincidem");
      return;
    }

    setLoadingLocal(true);

    const novoCliente = {
      nome,
      email,
      setor,
      empresa,
      senha,
    };

    try {
      await addCliente(novoCliente);

      // Resetar campos
      setNome("");
      setEmail("");
      setSetor("");
      setEmpresa("");
      setSenha("");
      setConfirmarSenha("");

      // Começa fechamento
      setIsClosing(true);
      onClose();

    } catch (error) {
      console.error(error);
      setError("Erro ao criar cliente");
      setLoadingLocal(false);
    }
  };

  // Quando a animação do modal terminar de fechar (Fade sair)
  const handleExited = () => {
    if (isClosing) {
      setIsClosing(false);
      setLoadingLocal(false);
      if (onCreateSuccess) onCreateSuccess();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        if (!loadingLocal) onClose();
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
    >
      <Fade in={isOpen} timeout={300} onExited={handleExited}>
        <Box sx={style}>
          <IconButton
            onClick={() => {
              if (!loadingLocal) onClose();
            }}
            sx={{ position: "absolute", right: 12, top: 12 }}
            disabled={loadingLocal}
            aria-label="fechar modal"
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Dados Pessoais
          </Typography>
          <Typography variant="caption" color="text.secondary" fontSize={14} gutterBottom>
            Defina as informações do perfil do cliente
          </Typography>

          <form onSubmit={handleSubmit}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom>
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
              disabled={loadingLocal}
            />

            <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom>
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
              disabled={loadingLocal}
            />

            <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom>
              SETOR
            </Typography>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Nome do Setor"
              sx={{ mb: 2 }}
              required
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              disabled={loadingLocal}
            />

            <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom>
              EMPRESA
            </Typography>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Nome da Empresa"
              sx={{ mb: 2 }}
              required
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              disabled={loadingLocal}
            />

            <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom>
              SENHA
            </Typography>
            <TextField
              fullWidth
              type={showSenha ? "text" : "password"}
              variant="standard"
              placeholder="Senha"
              sx={{ mb: 2 }}
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loadingLocal}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowSenha(!showSenha)}
                      edge="end"
                      disabled={loadingLocal}
                      aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showSenha ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography variant="caption" fontWeight="bold" color="text.secondary" gutterBottom>
              CONFIRMAR SENHA
            </Typography>
            <TextField
              fullWidth
              type={showConfirmarSenha ? "text" : "password"}
              variant="standard"
              placeholder="Confirme a senha"
              sx={{ mb: 2 }}
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              disabled={loadingLocal}
              error={senhasNaoConferem}
              helperText={senhasNaoConferem ? "As senhas não coincidem" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                      edge="end"
                      disabled={loadingLocal}
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
              <Button
                type="submit"
                variant="contained"
                disabled={loadingLocal || senhasNaoConferem}
                sx={{
                  bgcolor: "#111",
                  px: 6,
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#000",
                  },
                }}
              >
                {loadingLocal ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
}