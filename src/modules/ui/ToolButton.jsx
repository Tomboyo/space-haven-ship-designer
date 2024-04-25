export default function ToolButton({ active, children, onClick }) {
  const className = active ? "active" : "";
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
