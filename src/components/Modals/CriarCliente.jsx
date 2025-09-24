import { 
  Box, 
  Modal, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useClientes } from "../../context/ClientesContext";
import { useAuth } from "../../context/auth-context";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function ModalCriarCiente({ isOpen, onClose }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: '#fafafa',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    p: 4,
  };

  const { addCliente } = useClientes();
  const { token } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [setor, setSetor] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const senhasNaoConferem = senha && confirmarSenha && senha !== confirmarSenha;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (senhasNaoConferem) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    const novoCliente = {
      nome,
      email,
      setor,
      empresa,
      senha,
    };

    try {
      const response = await fetch("https://api-sdc.onrender.com/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoCliente),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar cliente");
      }

      const data = await response.json();

      addCliente(data);
      onClose();

      // Resetar formulário
      setNome("");
      setEmail("");
      setSetor("");
      setEmpresa("");
      setSenha("");
      setConfirmarSenha("");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
          disabled={loading}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold">
          Dados Pessoais
        </Typography>
        <Typography variant="caption" color="text.secondary" fontSize={14}>
          Defina as informações do perfil do cliente
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
            E-MAIL
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
            type="text"
            variant="standard"
            placeholder="Nome do Setor"
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
            type="text"
            variant="standard"
            placeholder="Nome da Empresa"
            sx={{ mb: 2 }}
            required
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
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
            sx={{ mb: 2 }}
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowSenha(!showSenha)}
                    edge="end"
                  >
                    {showSenha ? <VisibilityOff /> : <Visibility />}
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
            type={showConfirmarSenha ? "text" : "password"}
            variant="standard"
            placeholder="Confirme a senha"
            sx={{ mb: 2 }}
            required
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
              disabled={loading || senhasNaoConferem}
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
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
