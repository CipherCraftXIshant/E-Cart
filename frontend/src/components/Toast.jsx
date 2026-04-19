import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="toast-el">
      <span style={{ fontSize: 18 }}>{toast.icon}</span>
      <span>{toast.msg}</span>
    </div>
  );
}