import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import type { ReactNode } from 'react';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  ariaLabel?: string;
  onClose: () => void;
  children: ReactNode;
};

const modalRoot = document.getElementById('modals') ?? document.body;

export const Modal = ({
  title,
  ariaLabel,
  onClose,
  children,
}: TModalProps): React.JSX.Element => {
  useEffect(() => {
    const handleEscKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKeyDown);

    return (): void => {
      document.removeEventListener('keydown', handleEscKeyDown);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title ?? 'Модальное окно'}
      >
        <div className={`${styles.header} ${!title ? styles.header_empty : ''} mb-4`}>
          {title && (
            <h2 className={`${styles.title} text text_type_main-large`}>{title}</h2>
          )}
          <button
            className={styles.close}
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
          >
            <CloseIcon type="primary" />
          </button>
        </div>
        {children}
      </div>
    </>,
    modalRoot
  );
};
