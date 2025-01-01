import { FaEdit, FaTimes } from 'react-icons/fa';
// import style from './index.module.scss';

export default function EditCloseSelectButton({ isEditing, onToggleEdit }) {
  return (
    <button
      onClick={() => {
        console.log('Edit button clicked!');
        onToggleEdit();
      }}
    >
      {isEditing ? <FaTimes /> : <FaEdit />}
    </button>
  );
}
