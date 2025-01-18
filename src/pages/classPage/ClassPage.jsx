import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import style from './index.module.scss';
import ClassPupils from '../../features/сlassesRelations/classesPupils/ClassPupils';
import MultiSelect from '../../features/selects/MultiSelect';
import EditCloseSelectButton from '../../features/selects/EditCloseSelectButton';
import ClassTeacher from '../../features/сlassesRelations/classTeacher/ClassTeacher';
import { setClassTeacher } from '../../features/сlassesRelations/classTeacher/redux/classTeacherSlice';
import {
  addTeachersSubjectRelation,
  removeTeacherSubjectRelation,
} from '../../features/teachersRelations/teachersSubjects/redux/teachersSubjectsSlice';
import { selectClassById } from '../../features/сlassesRelations/classesPupils/redux/classesPupilsSlice';

export default function ClassPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { classId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const classData = useSelector(state => selectClassById(state, classId));
  const pupils = useSelector(state => state.pupils.pupils || []);
  const teachers = useSelector(state => state.teachers.teachers || []);
  const subjects = useSelector(state => state.subjects.subjects || []);
  const teachersClasses = useSelector(state => state.teachersClasses.teachersClasses || []);
  const teachersSubjects = useSelector(state => state.teachersSubjects.teachersSubjects || []);

  const handleTeacherChange = useCallback(
    e => {
      const newTeacherId = e.target.value;
      dispatch(setClassTeacher({ classId: classData.id, teacherId: newTeacherId }));
    },
    [dispatch, classData]
  );

  const classTeachers = useMemo(
    () =>
      teachers.filter(teacher =>
        teachersClasses.some(tc => tc.classId === classData?.id && tc.teacherId === teacher.id)
      ),
    [teachers, teachersClasses, classData]
  );

  const subjectOptions = useMemo(
    () =>
      subjects.map(subjectItem => ({
        label: subjectItem.name,
        value: subjectItem.id,
      })),
    [subjects]
  );

  const getSelectedSubjects = useCallback(
    teacherId => {
      return teachersSubjects
        .filter(ts => ts.teacherId === teacherId)
        .map(ts => {
          const subjectItem = subjects.find(sub => sub.id === ts.subjectId);
          return subjectItem ? { label: subjectItem.name, value: subjectItem.id } : null;
        })
        .filter(Boolean);
    },
    [teachersSubjects, subjects]
  );

  const handleSubjectSelectionChange = useCallback(
    (selectedSubjects, teacherId) => {
      const currentSubjects = teachersSubjects.filter(ts => ts.teacherId === teacherId);

      selectedSubjects.forEach(selected => {
        if (!currentSubjects.some(ts => ts.subjectId === selected.value)) {
          dispatch(addTeachersSubjectRelation({ teacherId, subjectId: selected.value }));
        }
      });
      currentSubjects.forEach(ts => {
        if (!selectedSubjects.some(sc => sc.value === ts.subjectId)) {
          dispatch(removeTeacherSubjectRelation({ teacherId, subjectId: ts.subjectId }));
        }
      });
    },
    [dispatch, teachersSubjects]
  );

  const toggleEditing = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const classPupils = useMemo(
    () => pupils.filter(pupil => pupil.classId === classData?.id),
    [pupils, classData]
  );

  const handleClick = () => {
    navigate('/testing');
  };
  const handleGoBack = () => {
    navigate(-1);
  };

  if (!classData) {
    return <p>Class not found</p>;
  }

  return (
    <>
      <h2 onClick={handleClick} className={style.h2Link}>
        Home
      </h2>

      <button onClick={handleGoBack}>Go Back</button>

      <div>
        <h1>{classData.name}</h1>

        <ClassTeacher
          teachers={teachers}
          classId={classData?.id}
          handleTeacherChange={handleTeacherChange}
        />

        <h3>Teachers of this class:</h3>
        <EditCloseSelectButton isEditing={isEditing} onToggleEdit={toggleEditing} />

        <ul>
          {classTeachers.map(teacher => (
            <li key={teacher.id}>
              <h4>{teacher.name}</h4>
              {isEditing ? (
                <MultiSelect
                  value={getSelectedSubjects(teacher.id)}
                  onChange={selectedSubjects =>
                    handleSubjectSelectionChange(selectedSubjects, teacher.id)
                  }
                  options={subjectOptions}
                  placeholder="Select subjects"
                />
              ) : (
                <span>
                  {getSelectedSubjects(teacher.id)
                    .map(sub => sub.label)
                    .join(', ') || 'No subjects assigned'}
                </span>
              )}
            </li>
          ))}
        </ul>

        <h3>Pupils of this class:</h3>
        <ClassPupils classPupils={classPupils} />
      </div>
    </>
  );
}
