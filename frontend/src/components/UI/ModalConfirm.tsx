import React from 'react';
import { Modal, ModalProps } from 'antd';

export interface ModalConfirmProps extends ModalProps {
  content: React.ReactNode;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({ content, ...props }) => {
  return (
    <Modal {...props}>
      {content}
    </Modal>
  );
};

export default ModalConfirm;