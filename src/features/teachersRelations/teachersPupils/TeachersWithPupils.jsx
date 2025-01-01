import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo, useState } from 'react';
import style from './index.module.scss';
import {
  addTeachersSubjectRelation,
  removeTeacherSubjectRelation,
} from './redux/teachersSubjectsSlice';
import MultiSelect from '../selects/MultiSelect';
import EditCloseSelectButton from '../selects/EditCloseSelectButton';
import SelectOptionsToText from '../selects/SelectOptionsToText';
import { selectTeachersSubjects } from './redux/teachersSubjectsSelector';
import { selectTeachers } from '../../components/teachersList/redux/teachersSlice';
import { selectSubjects } from '../../components/subjectsList/redux/subjectsSlice';

export default function TeachersWithPupils() {
  const dispatch = useDispatch();
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  const teachers = useSelector(selectTeachers);
  const subjects = useSelector(selectSubjects);
  const teachersSubjects = useSelector(selectTeachersSubjects);

  const handleSubjectSelectionChange = useCallback(
    (selectedSubjects, teacherId) => {
      const selectedSubjectIds = selectedSubjects.map(subject => subject.value);

      const currentTeacher = teachersSubjects.find(ts => ts.teacherId === teacherId);
      const currentSubjectIds = currentTeacher?.subjectIds || [];

      const subjectsToAdd = selectedSubjectIds.filter(id => !currentSubjectIds.includes(id));
      const subjectsToRemove = currentSubjectIds.filter(id => !selectedSubjectIds.includes(id));

      if (subjectsToAdd) {
        dispatch(addTeachersSubjectRelation({ teacherId, subjectIds: subjectsToAdd }));
      }
      if (subjectsToRemove) {
        dispatch(removeTeacherSubjectRelation({ teacherId, subjectIds: subjectsToRemove }));
      }
    },
    [dispatch, teachersSubjects]
  );

  const subjectOptions = useMemo(() => {
    return subjects.map(subjectItem => ({
      label: subjectItem.name,
      value: subjectItem.id,
    }));
  }, [subjects]);

  const getSelectedSubjects = useCallback(
    teacherId => {
      const teacherSubjects = teachersSubjects.find(ts => ts.teacherId === teacherId);
      if (!teacherSubjects) return [];

      return teacherSubjects.subjectIds
        .map(subjectId => {
          const subjectItem = subjects.find(subject => subject.id === subjectId);
          return subjectItem ? { label: subjectItem.name, value: subjectItem.id } : null;
        })
        .filter(Boolean);
    },
    [subjects, teachersSubjects]
  );

  if (!teachers || !subjects || !teachersSubjects) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>Teachers with subjects</h2>
      <div>
        <ol>
          {teachers.map(teacher => (
            <li key={teacher.id} className={style.teacherItem}>
              <div>
                <span>
                  {teacher.name}:
                  <span className={style.subjectsList}>
                    <SelectOptionsToText selectedOptions={getSelectedSubjects(teacher.id)} />
                  </span>
                </span>
                <EditCloseSelectButton
                  isEditing={editingTeacherId === teacher.id}
                  onToggleEdit={() =>
                    setEditingTeacherId(prevId => (prevId === teacher.id ? null : teacher.id))
                  }
                />
              </div>
              {editingTeacherId === teacher.id && (
                <MultiSelect
                  value={getSelectedSubjects(teacher.id)}
                  onChange={selectedSubjects =>
                    handleSubjectSelectionChange(selectedSubjects, teacher.id)
                  }
                  options={subjectOptions}
                  placeholder="Select subjects"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
