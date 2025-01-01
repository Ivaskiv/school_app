import { useDispatch, useSelector } from 'react-redux';
import useEnterKeyHandler from '../../hooks/useEnterKeyHandler';
import Draggable from '../../utils/dnd/Draggable';
import style from './index.module.scss';
import { useCallback, useState } from 'react';
import { addSubject, removeSubject } from './redux/subjectsSlice';
import { v4 as uuidv4 } from 'uuid';

export default function SubjectsList() {
  const dispatch = useDispatch();
  const subjects = useSelector(state => state.subjects.subjects);

  const [subjectName, setSubjectName] = useState('');

  const handleAddSubject = useCallback(() => {
    if (subjectName.trim()) {
      const newPupil = {
        id: uuidv4(),
        name: subjectName,
      };
      dispatch(addSubject(newPupil));
      setSubjectName('');
    }
  }, [dispatch, subjectName]);

  const handleRemoveSubject = useCallback(
    id => {
      dispatch(removeSubject(id));
    },
    [dispatch]
  );
  const handleKeyDown = useEnterKeyHandler(handleAddSubject);

  return (
    <div className={style.subjectsContainer}>
      <h2>Subjects</h2>
      <div className={style.inputContainer}>
        <input
          placeholder="Add subject"
          value={subjectName}
          onChange={e => setSubjectName(e.target.value)}
          onKeyDown={handleKeyDown}
          className={style.inputField}
        />
        <button onClick={handleAddSubject} className={style.addButton}>
          Add subject
        </button>
      </div>

      <div className={style.subjectsList}>
        {subjects && subjects.length > 0 ? (
          <table className={style.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={subject.id} className={style.classItem}>
                  <td>
                    <span className={style.itemNumber}>{index + 1}</span>
                  </td>
                  <td>
                    <Draggable id={`subject-${subject.id}`}>{subject.name}</Draggable>
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemoveSubject(subject.id)}
                      className={style.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No subjects</p>
        )}
      </div>
    </div>
  );
}
