import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.scss';

export default function DashboardPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const togglePanel = () => {
    setIsCollapsed(prevState => !prevState);
  };

  return (
    <div className={`${style.dashboardPanelContainer} ${isCollapsed ? style.collapsed : ''}`}>
      <button
        className={`${style.toggleButton} ${isCollapsed ? style.collapsed : ''}`}
        onClick={togglePanel}
      >
        {isCollapsed ? '>' : '<'}
      </button>
      <ul className={`${style.navList} ${isCollapsed ? style.hidden : ''}`}>
        {[
          'Головна панель',
          'Реєстрація школи',
          'Управління класами',
          'Управління вчителями',
          'Управління учнями',
          'Звіти',
          'Розклад',
          'Перегляд школи',
        ].map((text, index) => (
          <li key={index}>
            <Link to={index === 7 ? '/school/123' : `/${text.toLowerCase().replace(/\s/g, '-')}`}>
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
