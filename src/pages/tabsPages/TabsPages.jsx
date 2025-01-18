import style from './index.module.scss';
import { useMemo, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { copyTeacher, selectTeachers } from '../../components/teachersList/redux/teachersSlice';
import Tabs from '../../utils/tabs/Tabs';
import { selectClasses } from '../../components/classesList/redux/classesSlice';
import { selectSubjects } from '../../components/subjectsList/redux/subjectsSlice';
import ClassesWithPupils from '../../features/сlassesRelations/classesPupils/ClassesWithPupils';
import ClassesWithTeachers from '../../features/сlassesRelations/classesTeachers/ClassesWithTeachers';
import TeachersWithClasses from '../../features/teachersRelations/teachersClasses/TeachersWithClasses';
import ClassesWithSubjects from '../../features/сlassesRelations/classesSubject/ClassesWithSubjects';
import TeachersWithSubjects from '../../features/teachersRelations/teachersSubjects/TeachersWithSubjects';
import RelationshipTable from '../../features/tableRelations/relationshipTable/RelationshipTable';
// import { selectClassesSubjects } from '../../features/classesSubject/redux/classesSubjectsSelector';
// import { selectTeachersClasses } from '../../features/сlassesTeachersRelations/teachersClasses/redux/classesTeachersSelector';
// import { selectclassesTeachers } from '../../features/сlassesTeachersRelations/classesTeachers/redux/classesTeachersSelector';
// import AllRelationshipTable from '../../features/teacherClassSubjectTable/relationshipTable/AllRelationshipTable';
import { selectPupils, transferPupil } from '../../components/pupilsList/redux/pupilsSlice';

export default function TabsPages() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useSelector(selectClasses);
  const teachers = useSelector(selectTeachers);
  const subjects = useSelector(selectSubjects);
  const pupils = useSelector(selectPupils);
  // const classesTeachers = useSelector(selectclassesTeachers);
  // const teachersClasses = useSelector(selectTeachersClasses);
  // const classesSubjects = useSelector(selectClassesSubjects);

  const [currentTab, setCurrentTab] = useState('classesPupils');

  const handleDragEnd = ({ active, over }) => {
    if (!active || !over) return;

    const itemId = active.id.split('-')[1];
    const newClassId = parseInt(over.id.replace('class-', ''), 10);

    if (active.id.startsWith('pupil-')) {
      handlePupilTransfer(parseInt(itemId, 10), newClassId);
    } else if (active.id.startsWith('teacher-')) {
      handleTeacherCopy(parseInt(itemId, 10), newClassId);
    }
  };

  const handlePupilTransfer = (pupilId, newClassId) => {
    if (!pupilId || !newClassId) {
      console.error('Invalid pupil or class ID');
      return;
    }
    dispatch(transferPupil({ pupilId, newClassId }));
  };

  const handleTeacherCopy = (teacherId, newClassId) => {
    dispatch(copyTeacher({ teacherId, newClassId }));
  };

  const handleClick = () => {
    navigate('/');
  };

  const tabs = [
    {
      label: 'RelationshipTable',
      key: 'allTeacherClassSubjectTable',
      content: <RelationshipTable classes={classes} pupils={pupils} teachers={teachers} />,
    },

    {
      label: 'Classes & Pupils',
      key: 'classesPupils',
      content: useMemo(
        () => (
          <ClassesWithPupils
            classes={classes}
            pupils={pupils}
            onPupilTransfer={handlePupilTransfer}
            onTeacherCopy={handleTeacherCopy}
          />
        ),
        [classes, pupils]
      ),
    },

    {
      label: 'Classes & Teachers',
      key: 'classTeacher',
      content: (
        <ClassesWithTeachers
          classes={classes}
          teachers={teachers}
          // classesTeachers={classesTeachers}
          onPupilTransfer={handlePupilTransfer}
          onTeacherCopy={handleTeacherCopy}
        />
      ),
    },

    {
      label: 'Classes & Subject',
      key: 'classSubject',
      content: (
        <ClassesWithSubjects
          classes={classes}
          subjects={subjects}
          // classesSubjects={classesSubjects}
          onPupilTransfer={handlePupilTransfer}
          onTeacherCopy={handleTeacherCopy}
        />
      ),
    },

    {
      label: 'Teachers With Classes',
      key: 'teachersWithClasses',
      content: (
        <TeachersWithClasses
          classes={classes}
          teachers={teachers}
          // teachersClasses={teachersClasses}
        />
      ),
    },

    // {
    //   label: 'Subjects With Classes',
    //   key: 'subjectsWithClasses',
    //   content: <SubjectsWithClasses subjects={subjects} classes={classes} />,
    // },

    {
      label: 'Teachers With Subjects',
      key: 'teachersWithSubjects',
      content: <TeachersWithSubjects subjects={subjects} teachers={teachers} />,
    },

    // {
    //   label: 'AllRelationshipTable',
    //   key: 'teacherClassSubjectTable',
    //   content: <AllRelationshipTable classes={classes} pupils={pupils} teachers={teachers} />,
    // },
  ];

  return (
    <>
      <h2 onClick={handleClick} className={style.h2Link}>
        School Management
      </h2>
      <div className={style.tabContainer}>
        <DndContext onDragEnd={handleDragEnd}>
          <Tabs tabs={tabs} activeKey={currentTab} onChange={key => setCurrentTab(key)} />
        </DndContext>
      </div>
    </>
  );
}
