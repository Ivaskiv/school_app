import { useState } from 'react';
import EditCloseSelectButton from '../../selects/EditCloseSelectButton';
import { useSelector } from 'react-redux';

export default function ClassTeacher({ teachers, classId, handleTeacherChange }) {
  const [isEditing, setIsEditing] = useState(false);

  const classTeacher = useSelector(
    state =>
      state.teachersClasses.teachersClasses.find(tc => tc.classId === classId && tc.isClassTeacher)
        ?.teacherId
  );

  const currentTeacher = teachers.find(teacher => teacher.id === classTeacher);

  return (
    <div>
      <label>
        Class Teacher:
        {isEditing ? (
          <select value={classTeacher || ''} onChange={handleTeacherChange}>
            <option value="">Select a teacher</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        ) : (
          <span>{currentTeacher ? currentTeacher.name : 'No teacher assigned'}</span>
        )}
      </label>

      <EditCloseSelectButton isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)} />
    </div>
  );
}
