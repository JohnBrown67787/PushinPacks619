import styles from './Card.module.css';
import { classNames } from '../../lib/utils';

/**
 * Reusable Card component
 * @param {string} variant - 'default' | 'elevated' | 'outlined'
 * @param {boolean} hoverable - Add hover effect
 * @param {boolean} clickable - Show cursor pointer
 */
export default function Card({
  children,
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) {
  return (
    <div
      className={classNames(
        styles.card,
        styles[variant],
        hoverable ? styles.hoverable : '',
        clickable ? styles.clickable : '',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
