import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal deve ser usado dentro de um ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openProfileModal = () => {
  setIsProfileModalOpen(true);
};

const closeProfileModal = () => {
  setIsProfileModalOpen(false);
};

  return (
    <ModalContext.Provider 
      value={{
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};  