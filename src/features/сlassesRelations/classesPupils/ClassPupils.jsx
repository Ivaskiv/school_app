import style from './index.module.scss';

export default function ClassPupils({ classPupils }) {
  return (
    <div className={style.container}>
      <ul className={style.list}>
        {classPupils.length > 0 ? (
          classPupils.map(pupil => (
            <li key={pupil.id} className={style.item}>
              {pupil.name}
            </li>
          ))
        ) : (
          <li>-</li>
        )}
      </ul>
    </div>
  );
}
