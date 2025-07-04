import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Modal, EmptyState, ErrorState, ToastContainer } from '../../components';
import { useToast } from '../../context/ToastContext';
import styles from './ComponentShowcase.module.css';

const ComponentShowcase = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState('');
    const { showSuccess, showError, showWarning, showInfo } = useToast();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (e.target.value.length < 3 && e.target.value.length > 0) {
            setInputError('최소 3글자 이상 입력해주세요');
        } else {
            setInputError('');
        }
    };

    const handleToast = (type) => {
        switch (type) {
            case 'success':
                showSuccess('성공적으로 처리되었습니다!', '성공');
                break;
            case 'error':
                showError('오류가 발생했습니다. 다시 시도해주세요.', '오류');
                break;
            case 'warning':
                showWarning('주의가 필요한 작업입니다.', '경고');
                break;
            case 'info':
                showInfo('정보를 확인해주세요.', '알림');
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.content}
            >
                <h1 className={styles.title}>컴포넌트 쇼케이스</h1>
                <p className={styles.subtitle}>새로 추가된 디자인 시스템 컴포넌트들을 확인해보세요</p>

                {/* Button Section */}
                <section className={styles.section}>
                    <h2>Button 컴포넌트</h2>
                    <div className={styles.buttonGrid}>
                        <Button variant="primary" size="small">
                            Primary Small
                        </Button>
                        <Button variant="primary" size="medium">
                            Primary Medium
                        </Button>
                        <Button variant="primary" size="large">
                            Primary Large
                        </Button>

                        <Button variant="secondary" size="medium">
                            Secondary
                        </Button>
                        <Button variant="outline" size="medium">
                            Outline
                        </Button>
                        <Button variant="ghost" size="medium">
                            Ghost
                        </Button>

                        <Button variant="success" size="medium">
                            Success
                        </Button>
                        <Button variant="danger" size="medium">
                            Danger
                        </Button>

                        <Button variant="primary" size="medium" disabled>
                            Disabled
                        </Button>
                        <Button variant="primary" size="medium" loading>
                            Loading
                        </Button>
                        <Button variant="primary" size="medium" fullWidth>
                            Full Width
                        </Button>
                    </div>
                </section>

                {/* Input Section */}
                <section className={styles.section}>
                    <h2>Input 컴포넌트</h2>
                    <div className={styles.inputGrid}>
                        <Input label="기본 입력" placeholder="텍스트를 입력하세요" size="medium" />

                        <Input label="필수 입력" placeholder="필수 입력 필드" required size="medium" />

                        <Input
                            label="에러 상태"
                            placeholder="에러가 있는 입력"
                            error={inputError}
                            value={inputValue}
                            onChange={handleInputChange}
                            size="medium"
                        />

                        <Input label="비활성화" placeholder="비활성화된 입력" disabled size="medium" />

                        <Input
                            label="도움말 텍스트"
                            placeholder="도움말이 있는 입력"
                            helperText="이 필드는 선택사항입니다"
                            size="medium"
                        />
                    </div>
                </section>

                {/* Modal Section */}
                <section className={styles.section}>
                    <h2>Modal 컴포넌트</h2>
                    <div className={styles.buttonGrid}>
                        <Button variant="primary" onClick={() => setModalOpen(true)}>
                            모달 열기
                        </Button>
                    </div>
                </section>

                {/* Toast Section */}
                <section className={styles.section}>
                    <h2>Toast 알림</h2>
                    <div className={styles.buttonGrid}>
                        <Button variant="success" onClick={() => handleToast('success')}>
                            성공 알림
                        </Button>
                        <Button variant="danger" onClick={() => handleToast('error')}>
                            오류 알림
                        </Button>
                        <Button variant="outline" onClick={() => handleToast('warning')}>
                            경고 알림
                        </Button>
                        <Button variant="secondary" onClick={() => handleToast('info')}>
                            정보 알림
                        </Button>
                    </div>
                </section>

                {/* Empty State Section */}
                <section className={styles.section}>
                    <h2>Empty State 컴포넌트</h2>
                    <div className={styles.emptyStateGrid}>
                        <EmptyState
                            icon="calendar"
                            title="이벤트가 없습니다"
                            description="새로운 이벤트를 추가해보세요"
                            action={
                                <Button variant="primary" size="small">
                                    이벤트 추가
                                </Button>
                            }
                            size="small"
                        />

                        <EmptyState
                            icon="gift"
                            title="선물이 없습니다"
                            description="첫 번째 선물을 등록해보세요"
                            action={
                                <Button variant="outline" size="small">
                                    선물 등록
                                </Button>
                            }
                            size="small"
                        />
                    </div>
                </section>

                {/* Error State Section */}
                <section className={styles.section}>
                    <h2>Error State 컴포넌트</h2>
                    <div className={styles.errorStateGrid}>
                        <ErrorState
                            title="데이터를 불러올 수 없습니다"
                            message="네트워크 연결을 확인하고 다시 시도해주세요"
                            onRetry={() => console.log('Retry clicked')}
                            size="small"
                        />
                    </div>
                </section>
            </motion.div>

            {/* Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="샘플 모달" size="medium">
                <div className={styles.modalContent}>
                    <p>이것은 샘플 모달입니다. 다양한 크기와 옵션을 지원합니다.</p>
                    <div className={styles.modalActions}>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            취소
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setModalOpen(false);
                                showSuccess('모달에서 작업이 완료되었습니다!');
                            }}
                        >
                            확인
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ComponentShowcase;
