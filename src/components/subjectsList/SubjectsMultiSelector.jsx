import { useMemo } from 'react';
import style from './index.module.scss';

export default function SubjectsMultiSelector({
  subjects = [],
  selectedSubjects = [],
  onSubjectsChange,
}) {
  //1.відфільтрувати доступні
  const availableSubjects = useMemo(() => {
    return subjects.filter(
      subject => !selectedSubjects.some(selected => selected.id === subject.id)
    );
  }, [subjects, selectedSubjects]);

  //2.додати предмет
  const handleAddSubject = subjectId => {
    const subjectToAdd = subjects.find(subject => subject.id === subjectId);
    if (!subjectToAdd) return;

    const updatedSelectedSubjects = [...selectedSubjects, subjectToAdd];
    onSubjectsChange(updatedSelectedSubjects);
  };

  //3.видалити предмет
  const handleRemoveSubject = subjectId => {
    const updatedSelectedSubjects = selectedSubjects.filter(subject => subject.id !== subjectId);
    onSubjectsChange(updatedSelectedSubjects);
  };

  return (
    <div>
      <select onChange={e => handleAddSubject(e.target.value)} value="" className={style.selector}>
        <option value="" disabled>
          Choose a subject
        </option>
        {availableSubjects.map(subject => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>

      <div className={style.selectedSubjects}>
        {selectedSubjects.length > 0 ? (
          selectedSubjects.map(subject => (
            <div key={subject.id} className={style.selectedSubjectItem}>
              <span>{subject.name}</span>
              <button
                onClick={() => handleRemoveSubject(subject.id)}
                className={style.removeButton}
              >
                x
              </button>
            </div>
          ))
        ) : (
          <p className={style.placeholder}>No subjects selected</p>
        )}
      </div>
    </div>
  );
}
