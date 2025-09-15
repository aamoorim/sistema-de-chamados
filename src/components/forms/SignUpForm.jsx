import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SignUpForm = () => {
  const handleContactClick = () => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=suporte@empresa.com&su=Solicitação%20de%20Acesso&body=Olá,%20gostaria%20de%20solicitar%20um%20acesso.",
      "_blank"
    );
  };

  return (
    <Box
      className="form form-signup"
      sx={{
        width: "100%",
      }}
    >
      {/* CARD */}
      <Card
        className="card"
        sx={{
          width: "100%",
          maxWidth: "40rem",
          height: "60vh", // altura fixa
          borderRadius: "1rem",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // impede o conteúdo de "sair"
          flexShrink: 0,
        }}
      >
        <CardContent
          sx={{
            textAlign: "center",
            padding: "1rem",
            flex: "1 1 auto",
            overflowY: "auto", // scroll interno no conteúdo
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Box component="img" className="form-logo-signup" src="/logo_squad.png" alt="Logo da empresa SquadBi"/>
          <SupportAgentIcon sx={{ fontSize: "3rem", color: "primary.main" }} />

          <Typography
            variant="h3"
            component="h1"
            className="form-title"
            gutterBottom
          >
            Acesso Restrito
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: "1rem" }}
          >
            Usuários só podem ser cadastrados pelo administrador. Confira as
            dúvidas frequentes abaixo:
          </Typography>

          {/* Accordions */}
          <Accordion
            disableGutters
            sx={{
              textAlign: "left",
              width: "100%",
              borderRadius: 3,
              mb: "0.5rem",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2">
                Quem pode acessar a plataforma?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body3" color="text.secondary">
                Apenas clientes e técnicos cadastrados pelo administrador.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            sx={{
              textAlign: "left",
              width: "100%",
              borderRadius: 3,
              mb: "0.5rem",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2">Como solicitar um acesso?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body3" color="text.secondary">
                Entre em contato com o suporte informando seus dados para
                avaliação do administrador.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            sx={{ textAlign: "left", width: "100%", borderRadius: 3 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" >
                Esqueci minha senha, e agora?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body3" color="text.secondary">
                Entre em contato com o suporte para redefinição da senha.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Button
            variant="contained"
            color="primary"
            onClick={handleContactClick}
            className="form-button"
            sx={{ mt: "1.5rem" }}
          >
            Falar com suporte
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUpForm;
