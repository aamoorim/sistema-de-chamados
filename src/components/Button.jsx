import { Button } from "@mui/material";
import { Plus } from "lucide-react";

export default function Botao({ 
  children, 
  text, 
  iconOnly = false, 
  onClick,
  variant = "contained",
  size = "medium",
  ...props 
}) {
  // Se iconOnly for true, mostra apenas o ícone
  // Se text for fornecido, usa o text
  // Se children for fornecido, usa children
  // Senão, usa apenas o ícone como fallback

  const renderContent = () => {
    if (iconOnly) {
      return <Plus size={20} />;
    }
    
    if (children) {
      return (
        <>
          <Plus size={18} style={{ marginRight: text || children ? 8 : 0 }} />
          {children}
        </>
      );
    }
    
    if (text) {
      return (
        <>
          <Plus size={18} style={{ marginRight: 8 }} />
          {text}
        </>
      );
    }
    
    // Fallback: apenas ícone
    return <Plus size={20} />;
  };

  // Estilos dinâmicos baseados no conteúdo
  const getDynamicStyles = () => {
    const baseStyles = {
      borderRadius: '12px',
      backgroundColor: '#604FEB',
      '&:hover': {
        backgroundColor: '#604FEB',
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'none',
      textTransform: 'none',
      fontWeight: 500,
    };

    if (iconOnly) {
      return {
        ...baseStyles,
        height: 44,
        minWidth: 44,
        width: 44, // Força quadrado para ícone apenas
        padding: '8px',
      };
    }

    return {
      ...baseStyles,
      height: 44,
      minWidth: 44,
      padding: '8px 16px',
      minWidth: 'auto', // Permite crescer com conteúdo
    };
  };

  return (
    <Button 
      variant={variant}
      onClick={onClick}
      sx={getDynamicStyles()}
      {...props}
    >
      {renderContent()}
    </Button>
  );
}