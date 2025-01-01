import style from './index.module.scss';

export default function ClassSelector({ classes, currentClassId, onChange }) {
  if (!classes || classes.length === 0) {
    return <p>No classes available</p>;
  }
  return (
    <select
      className={style.select}
      value={currentClassId || ''}
      onChange={e => onChange(Number(e.target.value))}
    >
      <option value="" disabled>
        Сhoose a class
      </option>
      {classes.map(classItem => (
        <option key={classItem.id} value={classItem.id}>
          {classItem.name}
        </option>
      ))}
    </select>
  );
}
