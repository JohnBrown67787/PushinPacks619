'use client';

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          padding: '40px 20px',
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--color-border-default)',
          margin: '20px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '12px',
            }}>
              Something Went Wrong
            </h2>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              marginBottom: '24px',
              lineHeight: '1.6',
            }}>
              An unexpected error occurred. Our team has been notified. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                background: 'var(--color-brand-green)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: 'var(--text-sm)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--color-brand-green-hover)'}
              onMouseLeave={(e) => e.target.style.background = 'var(--color-brand-green)'}
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details style={{
                marginTop: '20px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-error-text)',
                  fontWeight: '600',
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-error-text)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
