import React from "react";

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" data-testid="modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
