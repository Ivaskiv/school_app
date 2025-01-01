import style from './index.module.scss';

export default function MultiClassSelector({ classes, selectedClassIds, onChange }) {
  function handleCheckboxChange(classId) {
    const updClassIds = selectedClassIds.includes(classId)
      ? selectedClassIds.filter(id => id !== classId)
      : [...selectedClassIds, classId];
    onChange(updClassIds);
  }

  return (
    <div className={style.multiClassSelector}>
      {Array.isArray(classes) && classes.length > 0 ? (
        classes.map(classItem => (
          <label key={classItem.id} className={style.classOption}>
            <input
              type="checkbox"
              checked={selectedClassIds.includes(classItem.id)}
              onChange={() => handleCheckboxChange(classItem.id)}
            />
            {classItem.name}
          </label>
        ))
      ) : (
        <p>No classes available</p>
      )}
    </div>
  );
}
