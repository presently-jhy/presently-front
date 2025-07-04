import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ToastContainer } from '../components/Toast/Toast';

const ToastContext = createContext();

const toastReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TOAST':
            return [...state, action.payload];
        case 'REMOVE_TOAST':
            return state.filter((toast) => toast.id !== action.payload);
        case 'CLEAR_ALL':
            return [];
        default:
            return state;
    }
};

export const ToastProvider = ({ children }) => {
    const [toasts, dispatch] = useReducer(toastReducer, []);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: 'info',
            duration: 5000,
            ...toast,
        };
        dispatch({ type: 'ADD_TOAST', payload: newToast });
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, []);

    const clearAll = useCallback(() => {
        dispatch({ type: 'CLEAR_ALL' });
    }, []);

    const showSuccess = useCallback(
        (message, title = 'Success') => {
            return addToast({ type: 'success', message, title });
        },
        [addToast]
    );

    const showError = useCallback(
        (message, title = 'Error') => {
            return addToast({ type: 'error', message, title });
        },
        [addToast]
    );

    const showWarning = useCallback(
        (message, title = 'Warning') => {
            return addToast({ type: 'warning', message, title });
        },
        [addToast]
    );

    const showInfo = useCallback(
        (message, title = 'Info') => {
            return addToast({ type: 'info', message, title });
        },
        [addToast]
    );

    const value = {
        toasts,
        addToast,
        removeToast,
        clearAll,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
