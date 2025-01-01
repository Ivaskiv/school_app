export default function Dashboard() {
  return (
    <div>
      <h1>Welcome to the School Management System</h1>
      <p>Here you can manage directors, deputies, teachers, and pupils.</p>
      <button onClick={() => alert('Register Director')}>Register Director</button>
      <button onClick={() => alert('Register Deputy')}>Register Deputy</button>
      <button onClick={() => alert('Register Teacher')}>Register Teacher</button>
      <button onClick={() => alert('Register Pupil')}>Register Pupil</button>
    </div>
  );
}
