export default function Card({ title, value, color }) {
  return (
    <div className="card">
      <p className="muted">{title}</p>
      <h2 style={{ color }}>{value}</h2>
    </div>
  );
}