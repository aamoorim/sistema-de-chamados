import React from "react";
import Chip from "@mui/material/Chip";
import { Clock } from "lucide-react";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export default function StatusChip({ label }) {
  const status = label?.toLowerCase();

  if (status === "aberto") {
    return (
      <Chip
        icon={<Clock size={16} />}
        label="Aberto"
        sx={{
          backgroundColor: "#D03E3E33",
          color: "#D03E3E",
          fontWeight: 500,
          "& .MuiChip-icon": { color: "#D03E3E" },
          marginLeft: 2.7,
          fontFamily: "Lato",
        }}
        size="small"
      />
    );
  }

  if (status === "andamento" || status === "em andamento") {
    return (
      <Chip
        icon={<Clock size={16} />}
        label="Em andamento"
        sx={{
          backgroundColor: "#355EC533",
          color: "#355EC5",
          fontWeight: 500,
          "& .MuiChip-icon": { color: "#355EC5" },
          marginLeft: 2.7,
          fontFamily: "Lato",
        }}
        size="small"
      />
    );
  }

  if (status === "finalizado" || status === "encerrado") {
    return (
      <Chip
        icon={<TaskAltIcon style={{ fontSize: 16, color: "#508B26" }} />}
        label="Finalizado"
        sx={{
          backgroundColor: "#508B2633",
          color: "#508B26",
          fontWeight: 500,
          marginLeft: 2.7,
          fontFamily: "Lato",
        }}
        size="small"
      />
    );
  }

  // Caso padrão (outros status)
  return (
    <Chip
      label={label}
      sx={{
        fontWeight: 500,
        marginLeft: 2.7,
        fontFamily: "Lato",
      }}
      size="small"
    />
  );
}
  