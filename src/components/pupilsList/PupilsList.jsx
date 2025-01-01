import Draggable from '../../utils/dnd/Draggable';
import style from './index.module.scss';
import { useState, useCallback } from 'react';
import useEnterKeyHandler from '../../hooks/useEnterKeyHandler';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { addPupil, removePupil, transferPupil } from './redux/pupilsSlice';

export default function PupilsList() {
  const dispatch = useDispatch();
  const pupils = useSelector(state => state.pupils.pupils || []);
  const classes = useSelector(state => state.classes.classes || []);
  const [pupilName, setPupilName] = useState('');

  const handleAddPupil = useCallback(() => {
    if (pupilName.trim()) {
      const newPupil = {
        id: uuidv4(),
        name: pupilName,
        classId: null,
      };
      dispatch(addPupil(newPupil));
      setPupilName('');
    }
  }, [pupilName, dispatch]);

  const handleRemovePupil = useCallback(
    id => {
      dispatch(removePupil(id));
    },
    [dispatch]
  );

  const handleKeyDown = useEnterKeyHandler(handleAddPupil);

  const classesOptions = classes.map(cl => ({
    label: cl.name,
    value: cl.id,
  }));

  const handleClassChange = useCallback(
    (selectedClass, pupilId) => {
      if (selectedClass) {
        dispatch(transferPupil({ pupilId, newClassId: selectedClass.value }));
      }
    },
    [dispatch]
  );

  return (
    <div className={style.pupilsListContainer}>
      <h2>Pupils</h2>
      <div className={style.input}>
        <input
          placeholder="Add pupil"
          value={pupilName}
          onChange={e => setPupilName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAddPupil} className={style.addButton}>
          Add pupil
        </button>
      </div>

      <div className={style.pupilList}>
        {pupils.length === 0 ? (
          <p>No pupils available.</p>
        ) : (
          <table className={style.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Class</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pupils.map((pupil, index) => (
                <tr key={pupil.id} className={style.row}>
                  <td>
                    <span className={style.itemNumber}>{index + 1}</span>
                  </td>
                  <td>
                    <Draggable id={`pupil-${pupil.id}`}>{pupil.name}</Draggable>
                  </td>
                  <td>
                    <Select
                      value={
                        pupil.classId
                          ? classesOptions.find(option => option.value === pupil.classId)
                          : null
                      }
                      onChange={selectedClass => handleClassChange(selectedClass, pupil.id)}
                      options={classesOptions}
                      placeholder="Select class"
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemovePupil(pupil.id)}
                      className={style.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
