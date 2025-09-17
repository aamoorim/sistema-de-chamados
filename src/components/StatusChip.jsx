import React from "react";
import Chip from "@mui/material/Chip";
import { Clock } from "lucide-react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

export default function StatusChip({ label }) {
  if (!label || typeof label !== "string") {
    // Se label inválido, renderize um chip neutro
    return (
      <Chip
        label="Desconhecido"
        size="small"
        sx={{
          fontWeight: 500,
          marginLeft: 2,
          fontFamily: "Lato",
          backgroundColor: "#ccc",
          color: "#666",
        }}
      />
    );
  }
  
  const status = label.toLowerCase().trim().replace(/_/g, ' ');

  switch (status) {
    case "espera":
    case "aberto":
    case "pendente":
      return (
        <Chip
          icon={<Clock size={16} style={{ color: "#D03E3E" }} />}
          label={status === "espera" ? "Espera" : status === "pendente" ? "Pendente" : "Aberto"}
          size="small"
          sx={{
            backgroundColor: "#D03E3E33",
            color: "#D03E3E",
            fontWeight: 500,
            marginLeft: 2,
            fontFamily: "Lato",
            "& .MuiChip-icon": {
              color: "#D03E3E",
            },
          }}
        />
      );

    case "andamento":
    case "em andamento":
    case "em_andamento": 
      return (
        <Chip
          icon={<Clock size={16} style={{ color: "#355EC5" }} />}
          label="Em andamento"
          size="small"
          sx={{
            backgroundColor: "#355EC533",
            color: "#355EC5",
            fontWeight: 500,
            marginLeft: 2,
            fontFamily: "Lato",
            "& .MuiChip-icon": {
              color: "#355EC5",
            },
          }}
        />
      );

    case "finalizado":
    case "encerrado":
    case "concluido":
    case "concluído":
    case "fechado":
      return (
        <Chip
          icon={<TaskAltIcon sx={{ fontSize: 16, color: "#508B26" }} />}
          label="Finalizado"
          size="small"
          sx={{
            backgroundColor: "#508B2633",
            color: "#508B26",
            fontWeight: 500,
            marginLeft: 2,
            fontFamily: "Lato",
          }}
        />
      );

    default:
      // Para valores não reconhecidos, mostrar o valor original com estilo neutro
      return (
        <Chip
          label={label}
          size="small"
          sx={{
            fontWeight: 500,
            marginLeft: 2,
            fontFamily: "Lato",
            backgroundColor: "#f5f5f5",
            color: "#666",
          }}
        />
      );
  }
} 