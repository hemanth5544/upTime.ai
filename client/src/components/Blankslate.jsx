export default function Blankslate({ icon: Icon, title, description }) {
  return (
    <div className="blankslate">
      {Icon && <Icon size={24} className="blankslate-icon" />}
      <h3 className="blankslate-title">{title}</h3>
      {description && <p className="muted">{description}</p>}
    </div>
  );
}
