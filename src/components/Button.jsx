import { Button } from "@mui/material";
import { Plus } from "lucide-react";

export default function Botao({ 
  children, 
  text, 
  iconOnly = false, 
  onClick,
  variant = "contained",
  size = "medium",
  icon, 
  sx = {},
  ...props 
}) {
  const IconComponent = icon || Plus; 

  const renderContent = () => {
    return (
      <>
        {icon && (
          <IconComponent size={18} style={{ marginRight: text || children ? 8 : 0 }} />
        )}
        {text}
        {children}
      </>
    );
  };

  const getDynamicStyles = () => {
    const baseStyles = {
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'none',
      textTransform: 'none',
      fontWeight: 500,
    };

    const containedStyles = {
      backgroundColor: '#604FEB',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#4e3dce',
      },
    };

    const outlinedStyles = {
      borderColor: '#604FEB',
      color: '#604FEB',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: '#f2f0ff',
        borderColor: '#4e3dce',
      },
    };

    const variantStyles = variant === 'outlined' ? outlinedStyles : containedStyles;

    const sizeStyles = iconOnly
      ? {
          height: 44,
          width: 44,
          minWidth: 44,
          padding: '8px',
        }
      : {
          height: 44,
          minWidth: 44,
          padding: '8px 16px',
        };

    return {
      ...baseStyles,
      ...variantStyles,
      ...sizeStyles,
    };
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={onClick}
      sx={[getDynamicStyles(), sx]}  
      {...props}
    >
      {renderContent()}
    </Button>
  );
}
