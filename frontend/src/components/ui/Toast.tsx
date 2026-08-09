import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Toast.css';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`ui-toast ui-toast-${toast.type}`}
    >
      <div className="ui-toast-content">
        <h4 className="ui-toast-title">{toast.title}</h4>
        <p className="ui-toast-message">{toast.message}</p>
      </div>
      <button className="ui-toast-close" onClick={() => onRemove(toast.id)}>
        <X size={16} />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="ui-toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};
