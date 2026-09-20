export type GameCardProps = {
  name: string;
  category: string;
  icon: string;
  status: string;
  accent?: string;
};

export function GameCard({ name, category, icon, status, accent = '#52e0a5' }: GameCardProps) {
  return (
    <article className="game-card" style={{ borderColor: `${accent}33` }}>
      <div className="game-icon" style={{ background: `linear-gradient(135deg, ${accent}25, #162d43)` }}>
        {icon}
      </div>
      <div>
        <p className="game-category">{category}</p>
        <h3>{name}</h3>
        <span className="status">{status}</span>
      </div>
    </article>
  );
}
