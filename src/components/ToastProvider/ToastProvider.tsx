import { createContext, useState, useCallback, ReactNode } from "react";
import useEscapeKey from "../../hooks/useEscapeKey";
import { v4 as uuidv4 } from "uuid";

interface Toast {
  id: string;
  message: string;
  variant: 'error' | 'success' | 'notice' | 'warning';
}

interface ToastContextType {
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
  createToast: (message: string, variant: 'error' | 'success' | 'notice' | 'warning') => void;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([
    {
      id: uuidv4(),
      message: "Something went wrong!",
      variant: "error",
    },
    {
      id: uuidv4(),
      message: "17 photos uploaded",
      variant: "success",
    },
  ]);

  const handleEscape = useCallback(() => {
    setToasts([]);
  }, []);

  useEscapeKey(handleEscape);

  function createToast(message: string, variant: 'error' | 'success' | 'notice' | 'warning') {
    const nextToasts = [
      ...toasts,
      {
        id: uuidv4(),
        message,
        variant,
      },
    ];

    setToasts(nextToasts);
  }

  function dismissToast(id: string) {
    const nextToasts = toasts.filter((toast) => {
      return toast.id !== id;
    });

    setToasts(nextToasts);
  }

  return (
    <ToastContext.Provider
      value={{ toasts, setToasts, createToast, dismissToast }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
