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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useEffect } from "react";
import { useClientes } from "../../context/ClientesContext";
import { useAuth } from "../../context/auth-context";
import api from "../../services/api"; 

export function ModalEditarCliente({ isOpen, onClose, cliente }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: '#fafafa',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    p: 3,
  };

  const { setClientes } = useClientes();
  const { token } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [setor, setSetor] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [erroConfirmacao, setErroConfirmacao] = useState(false);

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome || "");
      setEmail(cliente.email || "");
      setSetor(cliente.setor || "");
      setEmpresa(cliente.empresa || "");
      setSenha("");
      setConfirmarSenha("");
      setErroConfirmacao(false);
    }
  }, [cliente]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha.trim() && senha !== confirmarSenha) {
      setErroConfirmacao(true);
      return;
    }

    const clienteAtualizado = {
      nome,
      email,
      setor,
      empresa,
      ...(senha.trim() ? { senha } : {}),
    };

    try {
      const response = await api.put(
        `/clientes/${cliente.id}`,
        clienteAtualizado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setClientes((prev) =>
        prev.map((c) => (c.id === data.id ? data : c))
      );

      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar cliente");
    }
  };

  const senhasNaoConferem = senha && confirmarSenha && senha !== confirmarSenha;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold">
          Editar Cliente
        </Typography>
        <Typography variant="caption" color="text.secondary" fontSize={14} mb={2}>
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
          />

          {/* Senha */}
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            SENHA (DEIXE VAZIO CASO NÃO QUEIRA ALTERAR)
          </Typography>
          <TextField
            fullWidth
            type={mostrarSenha ? "text" : "password"}
            variant="standard"
            placeholder="Senha"
            sx={{ mb: 2 }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
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

          {/* Confirmar Senha */}
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
            onChange={(e) => {
              setConfirmarSenha(e.target.value);
              setErroConfirmacao(false);
            }}
            error={senhasNaoConferem || erroConfirmacao}
            helperText={senhasNaoConferem ? "As senhas não coincidem" : ""}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
                      {mostrarConfirmar ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
          />

          {/* Botão */}
          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              disabled={senhasNaoConferem}
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
              Salvar Alterações
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
