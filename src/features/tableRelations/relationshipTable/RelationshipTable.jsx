import style from './index.module.scss';
import { useState } from 'react';
import EditableTable from '../editableTable/EditableTable';

export default function RelationshipTable() {
  const [selectedTable, setSelectedTable] = useState('teachersSubjects');

  const tableTabs = [
    { id: 'teachersSubjectsClasses', label: 'Teacher-Subject-Classes' },
    { id: 'teachersClassesSubjects', label: 'Teacher-Class-Subjects' },
    { id: 'subjectsClassesTeachers', label: 'Subject-Class-Teachers' },
  ];

  return (
    <div className={style.wrapper}>
      <div className={style.tabs}>
        {tableTabs.map(({ id, label }) => (
          <button
            key={id}
            className={selectedTable === id ? style.active : ''}
            onClick={() => setSelectedTable(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={style.table}>
        <EditableTable tableType={selectedTable} />
      </div>
    </div>
  );
}
