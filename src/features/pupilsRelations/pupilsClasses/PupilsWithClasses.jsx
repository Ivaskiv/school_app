import { useDispatch, useSelector } from 'react-redux';
import { useState, useMemo, useCallback } from 'react';
import MultiSelect from '../../selects/MultiSelect'; // Використовуємо MultiSelect компонент для вибору
import EditCloseSelectButton from '../../selects/EditCloseSelectButton';
import SelectOptionsToText from '../../selects/SelectOptionsToText';
// import { selectTeachers } from '../../../components/teachersList/redux/teachersSlice';
// import { selectClasses } from '../../../components/classesList/redux/classesSlice';
// import { selectTeachersClasses } from './redux/teacherClassesSelector';
import { addTeacherClassRelation, removeTeacherClassRelation } from './redux/pupilsClassesSlice';
import style from './index.module.scss';

export default function PupilsWithClasses() {
  const dispatch = useDispatch();
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  const teachers = useSelector(state => state.teachers.teachers);
  const classes = useSelector(state => state.classes.classes);
  const teachersClasses = useSelector(state => state.teachersClasses.teachersClasses);

  const classOptions = useMemo(() => {
    return classes.map(classItem => ({
      label: classItem.name,
      value: classItem.id,
    }));
  }, [classes]);

  const getSelectedClasses = useCallback(
    teacherId => {
      const classesMap = new Map(
        classes.map(classItem => [classItem.id, { label: classItem.name, value: classItem.id }])
      );
      const teacherClasses = teachersClasses.find(tc => tc.teacherId === teacherId);
      return teacherClasses
        ? teacherClasses.classIds.map(id => classesMap.get(id)).filter(Boolean)
        : [];
    },
    [classes, teachersClasses]
  );

  const handleClassSelectionChange = useCallback(
    (selectedClasses, teacherId) => {
      const selectedClassIds = selectedClasses.map(classItem => classItem.value);
      const currentTeacher = teachersClasses.find(tc => tc.teacherId === teacherId);
      const currentClassIds = currentTeacher ? currentTeacher.classIds : [];

      const classesToAdd = selectedClassIds.filter(id => !currentClassIds.includes(id));
      const classesToRemove = currentClassIds.filter(id => !selectedClassIds.includes(id));

      if (classesToAdd.length > 0) {
        dispatch(addTeacherClassRelation({ teacherId, classIds: classesToAdd }));
      }
      if (classesToRemove.length > 0) {
        dispatch(removeTeacherClassRelation({ teacherId, classIds: classesToRemove }));
      }
    },
    [dispatch, teachersClasses]
  );

  if (!teachers || !classes || !teachersClasses) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2>Teachers with classes</h2>
      <div>
        <ol>
          {teachers.map(teacher => (
            <li key={teacher.id} className={style.teacherItem}>
              <div>
                <span>
                  {teacher.name}:
                  <span className={style.classesList}>
                    <SelectOptionsToText selectedOptions={getSelectedClasses(teacher.id)} />
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
                  value={getSelectedClasses(teacher.id)}
                  onChange={selectedClasses =>
                    handleClassSelectionChange(selectedClasses, teacher.id)
                  }
                  options={classOptions}
                  placeholder="Select classes"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
