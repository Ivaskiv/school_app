import style from './index.module.scss';

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footerContent}>
        <p>© 2024 School Management. All rights reserved.</p>
      </div>
    </footer>
  );
}
