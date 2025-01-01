import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

import ClassesList from '../../components/classesList/ClassesList';
import PupilsList from '../../components/pupilsList/PupilsList';
import TeachersList from '../../components/teachersList/TeachersList';
import SubjectsList from '../../components/subjectsList/SubjectsList';

import { addItem, deleteItem } from '../redux/schoolSlice';

import style from './index.module.scss';

export default function SchoolManagement() {
  const dispatch = useDispatch();

  const school = useSelector(state => state.school);
  const { teachers, pupils, classes, subjects } = school;

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
    <>
      <h2>School Management</h2>
      <Link to="/tabsPages" className={style.h2Link}>
        <h3>
          Classes & Pupils / Classes & Teachers / Teachers With Classes / Teachers With Subjects /
          Teacher & Class & Subject Table
        </h3>
      </Link>

      {error && <div className={style.error}>{error}</div>}
      <div className={style.listsContainer}>
        <TeachersList
          classes={classes}
          teachers={teachers}
          onAddTeacher={name => handleAddItem('teachers', name)}
          onDelTeacher={id => handleDelItem('teachers', id)}
        />

        <PupilsList
          classes={classes}
          pupils={pupils}
          onAddPupil={name => handleAddItem('pupils', name)}
          onDelPupil={id => handleDelItem('pupils', id)}
        />

        <ClassesList
          classes={classes}
          pupils={pupils}
          teachers={teachers}
          onAddClass={name => handleAddItem('classes', name)}
          onDelClass={id => handleDelItem('classes', id)}
        />

        <SubjectsList
          subjects={subjects}
          onAddSubject={name => handleAddItem('subjects', name)}
          onDelSubject={id => handleDelItem('subjects', id)}
        />
      </div>
    </>
  );
}
