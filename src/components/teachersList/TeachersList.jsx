import { useCallback, useState } from 'react';
import Draggable from '../../utils/dnd/Draggable';
import style from './index.module.scss';
import useEnterKeyHandler from '../../hooks/useEnterKeyHandler';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTeacher, removeTeacher } from './redux/teachersSlice';
import { v4 as uuidv4 } from 'uuid';

export default function TeachersList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const teachers = useSelector(state => state.teachers.teachers);
  const [teacherName, setTeacherName] = useState('');

  const handleAddTeacher = useCallback(() => {
    if (teacherName.trim()) {
      const newTeacher = {
        id: uuidv4(),
        name: teacherName,
      };
      dispatch(addTeacher(newTeacher));
      setTeacherName('');
    }
  }, [dispatch, teacherName]);

  const handleRemoveTeacher = useCallback(
    id => {
      dispatch(removeTeacher(id));
    },
    [dispatch]
  );
  const handleKeyDown = useEnterKeyHandler(handleAddTeacher);

  const handleTeacherClick = teacherId => {
    navigate(`/teacher/${teacherId}`);
  };

  return (
    <div className={style.teachersContainer}>
      <h2>Teachers</h2>

      <div className={style.inputContainer}>
        <input
          placeholder="Add teacher"
          value={teacherName}
          onChange={e => setTeacherName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAddTeacher} className={style.addButton}>
          Add Teacher
        </button>
      </div>

      <table className={style.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => (
            <tr
              key={teacher.id}
              className={style.row}
              onClick={() => handleTeacherClick(teacher.id)}
            >
              <td>
                <span className={style.itemNumber}>{index + 1}</span>
              </td>
              <td>
                <Draggable id={`teacher-${teacher.id}`}>{teacher.name}</Draggable>
              </td>
              <td>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveTeacher(teacher.id);
                  }}
                  className={style.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
