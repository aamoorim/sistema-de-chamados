import {
  Box,
  Modal,
  Typography,
  TextField,
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
import Botao from "../Button.jsx";
import { Plus } from "lucide-react";

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

  const { addCliente } = useClientes();

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [setor, setSetor] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Estado de exibição de senha
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // Controle de status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

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

  // senhaValida será true somente quando todos critérios + coincidência estiverem OK
  const senhaValida =
    validacoes.comprimento &&
    validacoes.espacos &&
    validacoes.maiuscula &&
    validacoes.minuscula &&
    validacoes.numero &&
    validacoes.especial &&
    senhasCoincidem;

  // Permite submissão quando: senha está vazia (gera-se automaticamente no back) OU senhaValida === true
  const podeSubmeter = !loading && (senha.trim() === "" || senhaValida);

  const senhasNaoConferem = senha && confirmarSenha && senha !== confirmarSenha;

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (senhasNaoConferem) {
      setError("As senhas não coincidem.");
      return;
    }

    // Se o admin preencheu senha, exige que ela seja válida conforme critérios
    if (senha.trim() && !senhaValida) {
      setError("A senha não atende aos requisitos mínimos.");
      return;
    }

    if (!nome.trim() || !email.trim() || !setor.trim() || !empresa.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    // Envia senha somente se preenchida
    const novoCliente = {
      nome: nome.trim(),
      email: email.trim(),
      setor: setor.trim(),
      empresa: empresa.trim(),
      ...(senha.trim() ? { senha: senha.trim() } : {}),
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

      // Fechar modal com leve delay visual
      setIsClosing(true);
      onClose();
    } catch (err) {
      console.error("❌ Erro ao criar cliente:", err);
      setError(
        err?.response?.data?.message ||
          "Erro inesperado ao criar o cliente. Tente novamente."
      );
      setLoading(false);
    } finally {
      // loading só fica false se não estiver no processo de sair (isClosing controla onCreateSuccess)
      if (!isClosing) setLoading(false);
    }
  };

  // Callback chamado após a animação de saída
  const handleExited = () => {
    if (isClosing) {
      setIsClosing(false);
      setLoading(false);
      if (onCreateSuccess) onCreateSuccess();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        if (!loading) onClose();
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
    >
      <Fade in={isOpen} timeout={300} onExited={handleExited}>
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

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Criar Cliente
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontSize={14}
            gutterBottom
          >
            Preencha os dados do novo cliente
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Nome */}
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
              gutterBottom
            >
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
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
              gutterBottom
            >
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
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
              gutterBottom
            >
              SETOR
            </Typography>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Setor do cliente"
              sx={{ mb: 2 }}
              required
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              disabled={loading}
            />

            {/* Empresa */}
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
              gutterBottom
            >
              EMPRESA
            </Typography>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Empresa do cliente"
              sx={{ mb: 2 }}
              required
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              disabled={loading}
            />

            {/* Senha */}
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
              gutterBottom
            >
              SENHA
            </Typography>
            <TextField
              fullWidth
              type={showSenha ? "text" : "password"}
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
                      onClick={() => setShowSenha(!showSenha)}
                      edge="end"
                      disabled={loading}
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

            {/* Confirmar senha */}
            <Typography
              variant="caption"
              fontWeight="bold"
              color="text.secondary"
              gutterBottom
            >
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
                {loading ? "Criando..." : "Criar Cliente"}
              </Botao>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
}
