import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo, useState } from 'react';
import style from './index.module.scss';
import { addClassTeacherRelation, removeClassTeacherRelation } from './redux/classesTeachersSlice';
import MultiSelect from '../../selects/MultiSelect';
import SelectOptionsToText from '../../selects/SelectOptionsToText';
import EditCloseSelectButton from '../../selects/EditCloseSelectButton';

export default function ClassesWithTeachers() {
  const dispatch = useDispatch();
  const [editingClassId, setEditingClassId] = useState(null);

  const classes = useSelector(state => state.classes.classes);
  const teachers = useSelector(state => state.teachers.teachers);
  const classesTeachers = useSelector(state => state.classesTeachers.classesTeachers);

  const handleTeacherSelectionChange = useCallback(
    (selectedTeachers, classId) => {
      const selectedTeacherIds = selectedTeachers.map(teacher => teacher.value);

      const currentTeachers = classesTeachers
        .filter(ct => ct.classId === classId)
        .map(ct => ct.teacherId);

      const teachersToAdd = selectedTeacherIds.filter(id => !currentTeachers.includes(id));
      const teachersToRemove = currentTeachers.filter(id => !selectedTeacherIds.includes(id));

      if (teachersToAdd.length) {
        dispatch(
          addClassTeacherRelation({
            classId,
            teacherIds: teachersToAdd,
          })
        );
      }
      if (teachersToRemove.length) {
        dispatch(removeClassTeacherRelation({ classId, teacherIds: teachersToRemove }));
      }
    },
    [dispatch, classesTeachers]
  );

  const teacherOptions = useMemo(() => {
    return teachers.map(teacherItem => ({
      label: teacherItem.name,
      value: teacherItem.id,
    }));
  }, [teachers]);

  const getSelectedTeachers = useCallback(
    classId => {
      const teacherIds = classesTeachers
        .filter(ct => ct.classId === classId)
        .map(ct => ct.teacherId);

      return teacherIds
        .map(teacherId => {
          const teacherItem = teachers.find(teacher => teacher.id === teacherId);
          return teacherItem ? { label: teacherItem.name, value: teacherItem.id } : null;
        })
        .filter(Boolean);
    },
    [teachers, classesTeachers]
  );

  if (!classes || !teachers || !classesTeachers) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>Classes with Teachers</h2>
      <div className={style.container}>
        <ol>
          {classes.map(classItem => (
            <li key={classItem.id} className={style.classItem}>
              <div>
                <span>
                  {classItem.name}:
                  <span className={style.teachersList}>
                    <SelectOptionsToText selectedOptions={getSelectedTeachers(classItem.id)} />
                  </span>
                </span>
                <EditCloseSelectButton
                  isEditing={editingClassId === classItem.id}
                  onToggleEdit={() =>
                    setEditingClassId(prevId => (prevId === classItem.id ? null : classItem.id))
                  }
                />
              </div>
              {editingClassId === classItem.id && (
                <MultiSelect
                  value={getSelectedTeachers(classItem.id)}
                  onChange={selectedTeachers =>
                    handleTeacherSelectionChange(selectedTeachers, classItem.id)
                  }
                  options={teacherOptions}
                  placeholder="Select teachers"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
