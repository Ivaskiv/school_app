import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { addItem, deleteItem } from '../../features/schools/redux/schoolsSlice';
import ClassesList from '../../components/classesList/ClassesList';
import PupilsList from '../../components/pupilsList/PupilsList';
import TeachersList from '../../components/teachersList/TeachersList';
import SubjectsList from '../../components/subjectsList/SubjectsList';
import style from './index.module.scss';

export default function SchoolManagement() {
  const dispatch = useDispatch();
  const school = useSelector(state => state.school);
  const { teachers = [], pupils = [], classes = [], subjects = [] } = school || {}; // Додано значення за замовчуванням

  const [error, setError] = useState('');

  const handleAddItem = (field, name, additionalData = {}) => {
    if (!name.trim()) {
      setError(`${field} name cannot be empty`);
      return;
    }

    const list = school[field];
    if (list.some(item => item.name === name.trim())) {
      setError(`${field} name must be unique`);
      return;
    }

    setError('');
    dispatch(addItem({ field, id: uuidv4(), name: name.trim(), ...additionalData }));
  };

  const handleDelItem = (field, id) => {
    dispatch(deleteItem({ field, itemId: id }));
  };

  return (
    <div className={style.schoolManagementContainer}>
      <h2>School Management</h2>
      <Link to="/tabsPages" className={style.h2Link}>
        <h3>Classes & Pupils / Classes & Teachers / Teachers With Subjects</h3>
      </Link>
      <section>
        <h3>Add or Remove Entities</h3>
        <div>
          <button onClick={() => handleAddItem('classes', 'New Class')}>Add Class</button>
          <button onClick={() => handleAddItem('subjects', 'New Subject')}>Add Subject</button>
          <button onClick={() => handleAddItem('teachers', 'New Teacher')}>Add Teacher</button>
          <button onClick={() => handleAddItem('pupils', 'New Pupil')}>Add Pupil</button>
        </div>
        <p>{error}</p>
      </section>
      <ClassesList classes={classes} onDelete={handleDelItem} />
      <PupilsList pupils={pupils} onDelete={handleDelItem} />
      <TeachersList teachers={teachers} onDelete={handleDelItem} />
      <SubjectsList subjects={subjects} onDelete={handleDelItem} />
    </div>
  );
}
