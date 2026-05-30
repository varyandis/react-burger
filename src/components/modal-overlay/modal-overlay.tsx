import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClose: () => void;
};

export const ModalOverlay = ({ onClose }: TModalOverlayProps): React.JSX.Element => (
  <div className={styles.overlay} aria-hidden="true" onClick={onClose} />
);
