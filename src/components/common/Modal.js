import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-gray-900 rounded-lg max-w-3xl w-[90%] 
        max-h-[90vh] overflow-auto">
        {children}
      </div>
    </div>,
    document.getElementById('modal-portal')
  );
};

export { MovieCard, LoadingSpinner, ErrorBoundary, Modal };