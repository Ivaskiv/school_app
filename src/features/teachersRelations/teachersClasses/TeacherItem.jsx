import EditCloseSelectButton from '../../selects/EditCloseSelectButton';
import MultiSelect from '../../selects/MultiSelect';
import SelectOptionsToText from '../../selects/SelectOptionsToText';
import style from './index.module.scss';

export default function TeacherItem({
  teacher,
  classOptions,
  getSelectedClasses,
  handleClassSelectionChange,
  editingTeacherId,
  setEditingTeacherId,
}) {
  return (
    <li className={style.teacherItem}>
      <div>
        <span>
          {teacher.name}:
          <span className={style.classesList}>
            <SelectOptionsToText selectedOptions={getSelectedClasses(teacher.id)} />
          </span>
        </span>
        <EditCloseSelectButton
          isEditing={editingTeacherId === teacher.id}
          onToggleEdit={() =>
            setEditingTeacherId(prevId => (prevId === teacher.id ? null : teacher.id))
          }
        />
      </div>
      {editingTeacherId === teacher.id && (
        <MultiSelect
          value={getSelectedClasses(teacher.id)}
          onChange={selectedClasses => handleClassSelectionChange(selectedClasses, teacher.id)}
          options={classOptions}
          placeholder="Select classes"
        />
      )}
    </li>
  );
}
