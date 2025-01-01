import { useDispatch, useSelector } from 'react-redux';
import { useState, useMemo, useCallback } from 'react';
import { addTeacherClassRelation, removeTeacherClassRelation } from './redux/teachersClassesSlice';
import TeacherItem from './TeacherItem';

export default function TeachersWithClasses() {
  const dispatch = useDispatch();
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  const teachers = useSelector(state => state.teachers.teachers); // Вибірка лише вчителів
  const classes = useSelector(state => state.classes.classes); // Вибірка лише класів
  const teachersClasses = useSelector(state => state.teachersClasses.teachersClasses); // Вибірка лише зв'язків

  const classOptions = useMemo(() => {
    return classes.map(classItem => ({
      label: classItem.name,
      value: classItem.id,
    }));
  }, [classes]);

  const classMap = useMemo(() => {
    return new Map(classes.map(classItem => [classItem.id, classItem]));
  }, [classes]);

  // Отримати вибрані класи для конкретного вчителя
  const getSelectedClasses = useCallback(
    teacherId => {
      const teacherClasses = teachersClasses.find(tc => tc.teacherId === teacherId);
      if (teacherClasses) {
        return teacherClasses.classIds
          .map(id => {
            const classItem = classMap.get(id);
            if (classItem) {
              return { label: classItem.name, value: id };
            }
            console.log(`Class ID ${id} not found in classMap`);
            return null;
          })
          .filter(Boolean); // Фільтруємо null значення
      }
      return [];
    },
    [classMap, teachersClasses]
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
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              classOptions={classOptions}
              getSelectedClasses={getSelectedClasses}
              handleClassSelectionChange={handleClassSelectionChange}
              editingTeacherId={editingTeacherId}
              setEditingTeacherId={setEditingTeacherId}
            />
          ))}
        </ol>
      </div>
    </>
  );
}
