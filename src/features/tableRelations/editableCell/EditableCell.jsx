import MultiSelect from '../../selects/MultiSelect';
import { FaSave, FaTimes } from 'react-icons/fa';
import style from './index.module.scss';

export default function EditableCell({ options, value, onSave, onCancel, onChange }) {
  return (
    <div className={style.editingContainer}>
      <MultiSelect isMulti value={value} onChange={onChange} options={options} />
      <div className={style.buttonContainer}>
        <button onClick={onSave} className={style.saveButton} aria-label="Save changes">
          <FaSave />
        </button>
        <button onClick={onCancel} className={style.closeButton} aria-label="Cancel changes">
          <FaTimes />
        </button>
      </div>
    </div>
  );
}
