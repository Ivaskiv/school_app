import { useDispatch, useSelector } from 'react-redux';
import useEnterKeyHandler from '../../hooks/useEnterKeyHandler';
import Draggable from '../../utils/dnd/Draggable';
import style from './index.module.scss';
import { useCallback, useState } from 'react';
import { addClass, removeClass } from './redux/classesSlice';
import { useNavigate } from 'react-router-dom';

export default function ClassesList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useSelector(state => state.classes.classes);
  console.log('classes', classes);
  const [className, setClassName] = useState('');

  const handleAddClass = useCallback(() => {
    if (className.trim()) {
      const isClass = classes.some(
        cls => cls.name.toLowerCase() === className.trim().toLowerCase()
      );
      if (isClass) {
        alert('Class with this name already exists!');
        return;
      }
      dispatch(addClass({ name: className.trim() }));
      setClassName('');
    }
  }, [dispatch, className, classes]);

  const handleRemoveClass = useCallback(id => dispatch(removeClass(id)), [dispatch]);

  const handleKeyDown = useEnterKeyHandler(handleAddClass);

  const handleClassClick = useCallback(classId => navigate(`/class/${classId}`), [navigate]);

  return (
    <div className={style.classesContainer}>
      <h2>Classes</h2>
      <div className={style.inputContainer}>
        <input
          placeholder="Add class"
          value={className}
          onChange={e => setClassName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAddClass} className={style.addButton}>
          Add class
        </button>
      </div>
      <div className={style.classesList}>
        {classes.length > 0 ? (
          <table className={style.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cl, index) => (
                <tr key={cl.id} className={style.itemLink} onClick={() => handleClassClick(cl.id)}>
                  <td>
                    <span className={style.itemNumber}>{index + 1}</span>
                  </td>
                  <td>
                    <Draggable id={`class-${cl.id}`}>{cl.name}</Draggable>
                  </td>
                  <td>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveClass(cl.id);
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
        ) : (
          <p>No classes available</p>
        )}
      </div>
    </div>
  );
}
