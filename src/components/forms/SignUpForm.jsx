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
          height: "72vh", // altura fixa
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
          <Box component="img" className="form-logo-signup" src="/logo_squad.png" alt="Logo da empresa SquadBi" />
          <SupportAgentIcon sx={{ fontSize: "3rem", color: "primary.main" }} />

         <Typography
          variant="h3"
          component="h1"
          className="form-title"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.5rem",  // até 480px
              sm: "1.8rem",  // até 768px
              md: "2.2rem",  // até 1024px
              lg: "3rem"   // acima de 1024px
            }
          }}
        >
          Acesso Restrito
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: "1rem",
            fontSize: {
              xs: "0.75rem",
              sm: "0.85rem",
              md: "0.95rem",
              lg: "1.25rem"
            }
          }}
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
              <Typography
                variant="body2"
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.85rem",
                    md: "0.95rem",
                    lg: "1.2rem"
                  }
                }}
              >
                Quem pode acessar a plataforma?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.8rem",
                    md: "0.9rem",
                    lg: "1.15rem"
                  }
                }}
              >
                Apenas clientes oficiais e técnicos credenciados da SquadBI.
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
              <Typography
                variant="body2"
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.85rem",
                    md: "0.95rem",
                    lg: "1.2rem"
                  }
                }}
              >
                Como solicitar um acesso?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.8rem",
                    md: "0.9rem",
                    lg: "1.15rem"
                  }
                }}
              >
                Para acessar a plataforma você precisa ser cadastrado pelo administrador da plataforma, para isso entre em contato com o suporte.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disableGutters
            sx={{ textAlign: "left", width: "100%", borderRadius: 3 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.85rem",
                    md: "0.95rem",
                    lg: "1.2rem"
                  }
                }}
              >
                Esqueci minha senha, o que fazer?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.8rem",
                    md: "0.9rem",
                    lg: "1.15rem"
                  }
                }}
              >
                Entre em contato com o suporte para redefinir sua senha.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Button
            variant="contained"
            color="primary"
            onClick={handleContactClick}
            className="form-button"
            sx={{
              mt: "1.5rem",
              fontSize: {
                xs: "0.75rem",     // até 480px
                sm: "0.85rem",     // até 768px
                md: "0.95rem",     // até 1024px
                lg: "1rem"         // acima de 1024px
              },
              padding: {
                xs: "10px 20px",
                sm: "12px 24px",
                md: "14px 28px",
                lg: "16px 32px"
              },
              width: {
                xs: "100%",
                sm: "80%",
                md: "60%",
                lg: "auto"
              },
              alignSelf: "center",
            }}
          >
            Falar com suporte
          </Button>

        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUpForm;
