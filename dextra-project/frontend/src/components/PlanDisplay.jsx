export default function PlanDisplay({ planBundle }) {
  const p = planBundle.plan;

  return (
    <div className="card">
      <h3>Plan</h3>

      <p>Exercise: {p.exercise}</p>
      <p>Intensity: {p.intensity}</p>
      <p>Reps: {p.reps}</p>
      <p>Hold: {p.holdTime}s</p>
      <p>Rest: {p.restTime}s</p>
    </div>
  );
}