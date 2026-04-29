export default function Gauges({ flex }) {
  const fingers = ["THUMB","INDEX","MIDDLE","RING","PINKY"];

  return (
    <div className="gauges">
      {fingers.map((f) => (
        <div key={f} className="gauge">
          <div className="bar">
            <div className="fill" style={{ width: `${flex[f] || 0}%` }} />
          </div>
          <p>{f}: {flex[f] || 0}%</p>
        </div>
      ))}
    </div>
  );
}