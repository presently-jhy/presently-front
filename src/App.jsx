// src/App.jsx
import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './router';
import CuteCursor from './components/CuteCursor/CuteCursor';
import EasterEgg from './components/EasterEgg/EasterEgg';
import { ToastProvider } from './context/ToastContext';
import './global.css';
import styles from './App.module.css';

function App() {
    return (
        <ToastProvider>
            <div className={styles.container}>
                <div className={styles.textSection}>
                    {/* 설명 글씨 영역 */}
                    <h1>Presently</h1>
                    <p>선물, 기념일, 더 완벽하게</p>
                </div>
                <div className={styles.phoneSection}>
                    {/* 모바일 프레임 고정용 wrapper */}
                    <div className={styles.componentView}>
                        <AppRoutes />
                    </div>
                </div>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                        className: '',
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                            borderRadius: '12px',
                            padding: '16px',
                            fontSize: '14px',
                            fontWeight: '500',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />

                {/* 귀여운 효과들 */}
                <CuteCursor />
                <EasterEgg />
            </div>
        </ToastProvider>
    );
}

export default App;
