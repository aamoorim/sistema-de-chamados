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
    
    return <Plus size={20} />;
  };

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
        width: 44,
        minWidth: 44,
        padding: '8px',
      };
    }

    return {
      ...baseStyles,
      height: 44,
      minWidth: 44,
      padding: '8px 16px',
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
