import { motion } from 'framer-motion';
import { Package, Calendar, Gift, Users, Search } from 'lucide-react';
import styles from './EmptyState.module.css';

const EmptyState = ({ icon = 'package', title, description, action, size = 'medium', className = '' }) => {
    const icons = {
        package: Package,
        calendar: Calendar,
        gift: Gift,
        users: Users,
        search: Search,
    };

    const Icon = icons[icon] || Package;

    return (
        <motion.div
            className={`${styles.container} ${styles[size]} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="status"
            aria-live="polite"
        >
            <div className={styles.icon}>
                <Icon size={size === 'small' ? 32 : size === 'large' ? 64 : 48} />
            </div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {description && <p className={styles.description}>{description}</p>}
            {action && <div className={styles.action}>{action}</div>}
        </motion.div>
    );
};

export default EmptyState;
