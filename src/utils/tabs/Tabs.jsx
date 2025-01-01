// import { useState } from 'react';
import style from './index.module.scss';

export default function Tabs({ tabs, activeKey, onChange }) {
  // const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={style.tabs}>
      <div className={style.tabsHeader}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClickCapture={() => onChange(tab.key)}
            className={tab.key === activeKey ? 'active' : ''}
            // className={`${style.tabButton} ${activeTab === index ? style.active : ''}`}
            // onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* <div className={style.tabContent}>{tabs[activeTab].content}</div> */}
      <div className={style.tabContent}>{tabs.find(tab => tab.key === activeKey)?.content}</div>
    </div>
  );
}
