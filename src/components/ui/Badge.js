import styles from './Badge.module.css';
import { classNames } from '../../lib/utils';

/**
 * Reusable Badge component
 * @param {string} variant - 'primary' | 'success' | 'warning' | 'error' | 'info'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <span
      className={classNames(
        styles.badge,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
