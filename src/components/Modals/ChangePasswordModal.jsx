import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Box,
  styled,
  InputAdornment
} from "@mui/material";
import { Close as CloseIcon, Visibility, VisibilityOff } from "@mui/icons-material";

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    padding: "8px",
    minWidth: "400px",
    maxWidth: "500px",
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    padding: "10px 0px",
  },
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: "9px",
  textTransform: "none",
  fontWeight: "bold",
  padding: "12px 0",
  fontSize: "16px",
  backgroundColor: "#000",
  "&:hover": {
    backgroundColor: "#111",
  },
}));

export default function ChangePasswordModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSave = () => {
    console.log("Alterar senha:", formData);
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px 16px",
          fontSize: "18px",
          fontWeight: 500,
          color: "#1f2937",
        }}
      >
        Alterar Senha
        <IconButton onClick={onClose} sx={{ padding: 0, color: "#6b7280" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "0 24px 24px", overflow: "visible" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <StyledTextField
            fullWidth
            label="Nova Senha"
            type={showPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleInputChange("newPassword")}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <StyledButton fullWidth variant="contained" onClick={handleSave}>
            Alterar
          </StyledButton>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
}
