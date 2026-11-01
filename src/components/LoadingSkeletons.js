export function ProductCardSkeleton({ className = '' }) {
  return (
    <div className={className} style={{
      background: 'var(--color-bg-card)',
      borderRadius: '8px',
      padding: '16px',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }}>
      <div style={{
        width: '100%',
        height: '200px',
        background: 'var(--color-border-default)',
        borderRadius: '6px',
        marginBottom: '12px',
      }} />
      <div style={{
        height: '16px',
        background: 'var(--color-border-default)',
        borderRadius: '4px',
        marginBottom: '8px',
      }} />
      <div style={{
        height: '12px',
        background: 'var(--color-border-default)',
        borderRadius: '4px',
        width: '80%',
        marginBottom: '12px',
      }} />
      <div style={{
        height: '14px',
        background: 'var(--color-border-default)',
        borderRadius: '4px',
        width: '40%',
      }} />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextSkeleton({ width = '100%', height = '16px', marginBottom = '12px' }) {
  return (
    <div style={{
      width,
      height,
      background: 'var(--color-border-default)',
      borderRadius: '4px',
      marginBottom,
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export function ImageSkeleton({ width = '100%', height = '300px', marginBottom = '12px' }) {
  return (
    <div style={{
      width,
      height,
      background: 'var(--color-border-default)',
      borderRadius: '8px',
      marginBottom,
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
