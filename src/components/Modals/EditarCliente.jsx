import { Box, Modal, Typography, TextField, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useClientes } from "../../context/ClientesContext";
import { useAuth } from "../../context/auth-context";

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
    p: 4,
  };

  const { setClientes } = useClientes();
  const { token } = useAuth();

  // Inicializa os estados com os dados do cliente recebido (ou vazio)
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [setor, setSetor] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [senha, setSenha] = useState(""); // pode ser senha nova ou vazio

  // Atualiza campos quando o cliente mudar (ex: abrir modal com outro cliente)
  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome || "");
      setEmail(cliente.email || "");
      setSetor(cliente.setor || "");
      setEmpresa(cliente.empresa || "");
      setSenha(""); // não preenche senha, só para nova senha
    }
  }, [cliente]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clienteAtualizado = {
      nome,
      email,
      setor,
      empresa,
      // Só inclui senha se foi preenchida (atualizar senha)
      ...(senha.trim() ? { senha } : {}),
    };

    try {
      const response = await fetch(
        `https://api-sdc.onrender.com/clientes/${cliente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(clienteAtualizado),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar cliente");
      }

      const data = await response.json();

      // Atualiza o contexto para refletir a alteração na tabela
      setClientes((prev) =>
        prev.map((c) => (c.id === data.id ? data : c))
      );

      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar cliente");
    }
  };

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
          />

          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            E-MAIL
          </Typography>
          <TextField
            fullWidth
            type="email"
            variant="standard"
            placeholder="exemplo@email.com"
            sx={{ mb: 4 }}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            SETOR
          </Typography>
          <TextField
            fullWidth
            type="text"
            variant="standard"
            placeholder="Nome do Setor"
            sx={{ mb: 4 }}
            required
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
          />

          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            EMPRESA
          </Typography>
          <TextField
            fullWidth
            type="text"
            variant="standard"
            placeholder="Nome da Empresa"
            sx={{ mb: 4 }}
            required
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          />

          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            SENHA (DEIXE VAZIO CASO NÃO QUEIRA ALTERAR)
          </Typography>
          <TextField
            fullWidth
            type="password"
            variant="standard"
            placeholder="Senha"
            sx={{ mb: 4 }}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
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
