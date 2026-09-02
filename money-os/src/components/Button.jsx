import { clsx } from 'clsx';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  className,
  disabled = false,
  type = 'button'
}) {
  return (
    <button
      type={type}
      className={clsx('btn', `btn-${variant}`, `btn-${size}`, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
