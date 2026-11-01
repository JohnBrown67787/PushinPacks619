import styles from './Input.module.css';
import { classNames } from '../../lib/utils';

/**
 * Reusable Input component
 * @param {string} type - 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} error - Error message to display
 * @param {boolean} disabled - Disable input
 */
export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  size = 'md',
  error,
  disabled = false,
  required = false,
  label,
  hint,
  className = '',
  ...props
}) {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={classNames(
          styles.input,
          styles[size],
          error ? styles.error : '',
          className
        )}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
