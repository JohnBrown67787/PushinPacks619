import { useState } from 'react';
import styles from './Tooltip.module.css';
import { classNames } from '../../lib/utils';

/**
 * Tooltip component
 * @param {string} content - Tooltip text content
 * @param {string} position - 'top' | 'bottom' | 'left' | 'right'
 * @param {string} delay - Delay before showing tooltip in ms
 */
export default function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
    }
    setIsVisible(false);
  };

  return (
    <div
      className={classNames(styles.tooltipWrapper, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={classNames(styles.tooltip, styles[position])}
          role="tooltip"
        >
          {content}
          <div className={styles.arrow} />
        </div>
      )}
    </div>
  );
}
