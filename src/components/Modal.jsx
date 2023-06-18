import { ComposedModal, ModalBody, ModalHeader } from "@carbon/react";
import PropTypes from "react";

function Modal({ open, onClose, children }) {
  return (
    <ComposedModal open={open} onClose={onClose} size="lg">
      <ModalHeader />
      <ModalBody>{children}</ModalBody>
    </ComposedModal>
  );
}

Modal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.element
}

export default Modal;
