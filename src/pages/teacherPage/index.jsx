import style from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addTeachersSubjectRelation,
  removeTeacherSubjectRelation,
} from '../../features/teachersRelations/teachersSubjects/redux/teachersSubjectsSlice';
import MultiSelect from '../../features/selects/MultiSelect';
import EditCloseSelectButton from '../../features/selects/EditCloseSelectButton';

export default function TeacherPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teacherId } = useParams();

  const [editingClassId, setEditingClassId] = useState(null);

  const teachers = useSelector(state => state.teachers.teachers || []);
  const classes = useSelector(state => state.classes.classes || []);
  const teachersClasses = useSelector(state => state.teachersClasses.teachersClasses || []);
  const teachersSubjects = useSelector(state => state.teachersSubjects.teachersSubjects || []);
  const subjects = useSelector(state => state.subjects.subjects || []);

  const teacher = teachers.find(t => t.id === teacherId);

  const teachingClasses = useMemo(
    () => teachersClasses.filter(tc => tc.teacherId === teacher.id),
    [teachersClasses, teacher.id]
  );

  const classSubjectsMap = useMemo(
    () =>
      teachingClasses.map(tc => {
        const className = classes.find(c => c.id === tc.classId)?.name || 'Unknown';

        const subjectsInClass = teachersSubjects
          .filter(ts => ts.teacherId === teacher.id && ts.classId === tc.classId)
          .map(ts => subjects.find(sub => sub.id === ts.subjectId)?.name || 'Unknown');

        return {
          classId: tc.classId,
          className,
          subjects: subjectsInClass,
        };
      }),
    [teachingClasses, classes, teachersSubjects, teacher.id, subjects]
  );

  const classTeacherName = teachingClasses.find(tc => tc.isClassTeacher)?.classId
    ? classes.find(c => c.id === teachingClasses.find(tc => tc.isClassTeacher)?.classId)?.name
    : 'No class';

  const subjectOptions = useMemo(
    () =>
      subjects.map(subject => ({
        label: subject.name,
        value: subject.id,
      })),
    [subjects]
  );

  const getSelectedSubjects = useCallback(
    classId =>
      teachersSubjects
        .filter(ts => ts.teacherId === teacher.id && ts.classId === classId)
        .map(ts => {
          const subjectItem = subjects.find(sub => sub.id === ts.subjectId);
          return subjectItem ? { label: subjectItem.name, value: subjectItem.id } : null;
        })
        .filter(Boolean),
    [teachersSubjects, subjects, teacher.id]
  );

  const handleSubjectSelectionChange = useCallback(
    (selectedSubjects, classId) => {
      const currentSubjects = teachersSubjects.filter(
        ts => ts.teacherId === teacher.id && ts.classId === classId
      );

      selectedSubjects.forEach(selected => {
        if (!currentSubjects.some(ts => ts.subjectId === selected.value)) {
          dispatch(
            addTeachersSubjectRelation({
              teacherId: teacher.id,
              subjectId: selected.value,
              classId,
            })
          );
        }
      });

      currentSubjects.forEach(ts => {
        if (!selectedSubjects.some(sc => sc.value === ts.subjectId)) {
          dispatch(
            removeTeacherSubjectRelation({
              teacherId: teacher.id,
              subjectId: ts.subjectId,
              classId,
            })
          );
        }
      });
    },
    [dispatch, teachersSubjects, teacher.id]
  );

  const handleGoHome = () => navigate('/testing');
  const handleGoBack = () => navigate(-1);
  if (!teacher) {
    return <p>Teacher not found</p>;
  }

  return (
    <>
      <h2 onClick={handleGoHome} className={style.h2Link}>
        Home
      </h2>

      <button onClick={handleGoBack}>Go Back</button>

      <h1>{teacher.name}</h1>
      <p>
        <strong>Class teacher:</strong> {classTeacherName}
      </p>
      <h3>List of classes - subjects:</h3>
      <ul>
        {classSubjectsMap.length > 0 ? (
          classSubjectsMap.map(({ classId, className, subjects }) => (
            <li key={classId} className={style.classItem}>
              <strong>{className}:</strong>
              {editingClassId === classId ? (
                <MultiSelect
                  value={getSelectedSubjects(classId)}
                  onChange={selectedSubjects =>
                    handleSubjectSelectionChange(selectedSubjects, classId)
                  }
                  options={subjectOptions}
                  placeholder="Select subjects"
                />
              ) : (
                subjects.join(', ') || 'No subjects'
              )}
              <EditCloseSelectButton
                isEditing={editingClassId === classId}
                onToggleEdit={() => setEditingClassId(editingClassId === classId ? null : classId)}
              />
            </li>
          ))
        ) : (
          <li>No classes assigned</li>
        )}
      </ul>
    </>
  );
}
