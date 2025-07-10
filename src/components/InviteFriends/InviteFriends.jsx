import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Mail, MessageCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './InviteFriends.module.css';

const InviteFriends = ({ eventData, onClose }) => {
    const [selectedMethod, setSelectedMethod] = useState('share');
    const [inviteMessage, setInviteMessage] = useState('');

    const eventUrl = `${window.location.origin}/eventview/${eventData?.id}`;
    const defaultMessage = `${eventData?.eventName || '이벤트'}에 초대합니다! 🎉`;

    const inviteMethods = [
        {
            id: 'share',
            icon: Share2,
            title: '공유하기',
            description: '링크를 복사하여 공유하세요',
            action: () => handleShare(),
        },
        {
            id: 'copy',
            icon: Copy,
            title: '링크 복사',
            description: '클립보드에 링크를 복사합니다',
            action: () => handleCopyLink(),
        },
        {
            id: 'email',
            icon: Mail,
            title: '이메일',
            description: '이메일로 초대장을 보냅니다',
            action: () => handleEmailInvite(),
        },
        {
            id: 'message',
            icon: MessageCircle,
            title: '메시지',
            description: 'SMS로 초대장을 보냅니다',
            action: () => handleMessageInvite(),
        },
    ];

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: eventData?.eventName || '이벤트 초대',
                    text: inviteMessage || defaultMessage,
                    url: eventUrl,
                });
                toast.success('공유가 완료되었습니다!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    toast.error('공유 중 오류가 발생했습니다.');
                }
            }
        } else {
            handleCopyLink();
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(eventUrl);
            toast.success('링크가 클립보드에 복사되었습니다!');
        } catch (error) {
            toast.error('링크 복사에 실패했습니다.');
        }
    };

    const handleEmailInvite = () => {
        const subject = encodeURIComponent(`${eventData?.eventName || '이벤트'} 초대`);
        const body = encodeURIComponent(inviteMessage || defaultMessage);
        const mailtoLink = `mailto:?subject=${subject}&body=${body}%0A%0A${eventUrl}`;
        window.open(mailtoLink);
        toast.success('이메일 앱이 열렸습니다!');
    };

    const handleMessageInvite = () => {
        const message = encodeURIComponent(`${inviteMessage || defaultMessage}\n\n${eventUrl}`);
        const smsLink = `sms:?body=${message}`;
        window.open(smsLink);
        toast.success('메시지 앱이 열렸습니다!');
    };

    return (
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modal}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <Users size={24} />
                        친구 초대하기
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.eventInfo}>
                        <h3>{eventData?.eventName || '이벤트'}</h3>
                        <p>{eventData?.eventDate || '날짜'}</p>
                    </div>

                    <div className={styles.messageSection}>
                        <label htmlFor="inviteMessage" className={styles.label}>
                            초대 메시지 (선택사항)
                        </label>
                        <textarea
                            id="inviteMessage"
                            className={styles.messageInput}
                            placeholder={defaultMessage}
                            value={inviteMessage}
                            onChange={(e) => setInviteMessage(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className={styles.methodsGrid}>
                        {inviteMethods.map((method) => (
                            <motion.button
                                key={method.id}
                                className={styles.methodCard}
                                onClick={method.action}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                                <div className={styles.methodIcon}>
                                    <method.icon size={24} />
                                </div>
                                <div className={styles.methodContent}>
                                    <h4>{method.title}</h4>
                                    <p>{method.description}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <div className={styles.linkSection}>
                        <label className={styles.label}>이벤트 링크</label>
                        <div className={styles.linkContainer}>
                            <input type="text" value={eventUrl} readOnly className={styles.linkInput} />
                            <button className={styles.copyButton} onClick={handleCopyLink} title="링크 복사">
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default InviteFriends;
