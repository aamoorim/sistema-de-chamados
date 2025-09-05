import React from "react";
import Chip from "@mui/material/Chip";
import { Clock } from "lucide-react";

export default function StatusChip({ label }) {
  return (
    <Chip
      icon={<Clock size={16} />}
      label={label}
      sx={{
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        fontWeight: 500,
        "& .MuiChip-icon": { color: "#b91c1c" },
        marginLeft:2.7
      }}
    />
  );
}