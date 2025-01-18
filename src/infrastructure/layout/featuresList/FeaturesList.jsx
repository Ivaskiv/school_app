import {
  FaRegFileAlt,
  FaChalkboardTeacher,
  FaCalendarCheck,
  FaLaptop,
  FaChartBar,
  FaBook,
  FaUniversity,
} from 'react-icons/fa';
import style from './index.module.scss';

export default function FeaturesList() {
  const features = [
    { icon: <FaUniversity />, label: 'Розклад' },
    { icon: <FaBook />, label: 'Журнали' },
    { icon: <FaChalkboardTeacher />, label: 'Щоденник' },
    { icon: <FaChartBar />, label: 'Дистанційне навчання' },
    { icon: <FaRegFileAlt />, label: 'Звіти' },
    { icon: <FaCalendarCheck />, label: 'Відвідуваність' },
    { icon: <FaLaptop />, label: 'Домашні завдання' },
    { icon: <FaChartBar />, label: 'Діаграми' },
  ];

  return (
    <section className={style.features}>
      <div className={style.featuresList}>
        {features.map((feature, index) => (
          <div key={index} className={style.featureItem}>
            <div className={style.icon}>{feature.icon}</div>
            <span>{feature.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
