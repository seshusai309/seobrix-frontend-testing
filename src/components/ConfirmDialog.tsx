'use client';
import { Modal } from './Modal';
import { Btn } from '@/components/ui';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger, loading }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={400}
      footer={<>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Btn>
      </>}>
      <p className="text-[13px] text-ink-2 leading-relaxed">{message}</p>
    </Modal>
  );
}
