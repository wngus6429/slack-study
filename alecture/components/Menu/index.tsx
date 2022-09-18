import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: any) => void;
  closeButton?: boolean;
}
const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation;
  }, []);

  if (!show) return null;

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
// Props들의 기본값 설정방법임
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
