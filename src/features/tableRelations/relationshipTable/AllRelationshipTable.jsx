import { useEffect, useState } from 'react';
import style from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import MultiSelect from '../../selects/MultiSelect';

export default function AllRelationshipTable() {
  const dispatch = useDispatch();

  const [isSubjectsView, setIsSubjectsView] = useState(true);
  const [editingCell, setEditingCell] = useState(null);
  const [tempSelection, setTempSelection] = useState([]);

  const {
    teachers = [],
    classes = [],
    subjects = [],
    teachersClassesSubjects = [],
  } = useSelector(state => state.teachersClassesSubjects);

  console.log('teachers', teachers);
  console.log('classes', classes);
  console.log('subjects', subjects);
  console.log('teachersClassesSubjects', teachersClassesSubjects);

  const getSubjectsForTeacherInClass = (teacherId, classId) => {
    const existingRelations = teachersClassesSubjects.find(
      relation => relation.teacherId === teacherId && relation.classId === classId
    );

    if (!existingRelations) return [];

    return existingRelations.subjectIds
      .map(subjectId => {
        const subjects = subjects.find(subject => subject.id === subjectId);
        return subjects ? { label: subjects.name, value: subjects.id } : null;
      })
      .filter(Boolean);
  };

  const updateTeacherSubjects = (teacherId, classId, selectedSubjectIds) => {
    teachersClassesSubjects(prevState =>
      prevState.map(relation =>
        relation.teacherId === teacherId && relation.classId === classId
          ? { ...relation, subjectIds: selectedSubjectIds }
          : relation
      )
    );
  };

  useEffect(() => {
    console.log('teachersClassesSubjects', teachersClassesSubjects);
    if (!teachersClassesSubjects || !Array.isArray(teachersClassesSubjects)) {
      console.error('teachersClassesSubjects is not an array or is undefined');
    }
  }, [teachersClassesSubjects]);

  const handleEdit = (teacherId, classId) => {
    const currentSubjects = getSubjectsForTeacherInClass(teacherId, classId);
    setEditingCell({
      teacherId,
      classId,
      tempSelection: currentSubjects,
    });
  };

  const handleSave = () => {
    if (!editingCell) return;

    const { teacherId, classId } = editingCell;
    const updatedSubjects = tempSelection.map(selected => selected.value);

    dispatch(updateTeacherSubjects({ teacherId, classId, subjectIds: updatedSubjects }));

    setEditingCell(null);
  };

  const handleCancel = () => {
    setEditingCell(null);
    setTempSelection([]);
  };

  const toggleView = () => {
    setIsSubjectsView(prev => !prev);
  };

  return (
    <div className={style.tableContainer}>
      <button onClick={toggleView} className={style.toggleButton}>
        {isSubjectsView ? 'Classes' : 'Subjects'}
      </button>

      {isSubjectsView ? (
        <table>
          <thead>
            <tr>
              <th>Teacher</th>
              {classes.map(classItem => (
                <th key={classItem.id}>{classItem.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id}>
                <td>{teacher.name}</td>
                {classes.map(classItem => {
                  const subjectsForTeacherInClass = getSubjectsForTeacherInClass(
                    teacher.id,
                    classItem.id
                  );
                  const isEditing =
                    editingCell &&
                    editingCell.teacherId === teacher.id &&
                    editingCell.classId === classItem.id;

                  return (
                    <td key={classItem.id}>
                      {isEditing ? (
                        <div className={style.editingContainer}>
                          <MultiSelect
                            isMulti
                            value={getSubjectsForTeacherInClass()}
                            onChange={selectedSubjects => {
                              setEditingCell(prev => ({
                                ...prev,
                                tempSelection: selectedSubjects,
                              }));
                            }}
                            options={subjects.map(subject => ({
                              label: subject.name,
                              value: subject.id,
                            }))}
                          />
                          <button onClick={handleSave} className={style.saveButton}>
                            <FaSave />
                          </button>
                          <button onClick={handleCancel} className={style.closeButton}>
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className={style.cellContent}>
                          {subjectsForTeacherInClass.length > 0
                            ? subjectsForTeacherInClass.map(s => s.label).join(', ')
                            : '-'}
                          <FaEdit
                            className={style.editIcon}
                            onClick={() => handleEdit(teacher.id, classItem.id)}
                          />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Class</th>
              {teachers.map(teacher => (
                <th key={teacher.id}>{teacher.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects.map(subject => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                {teachers.map(teacher => (
                  <td key={teacher.id}>-</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
