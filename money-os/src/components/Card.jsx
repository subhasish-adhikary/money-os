import { clsx } from 'clsx';

export default function Card({ children, className, padding = 'p-6', noBorder = false }) {
  return (
    <div className={clsx('card', padding, noBorder ? 'no-border' : '', className)}>
      {children}
    </div>
  );
}
