import { useRouter } from 'next/router';
import styles from './header.module.scss';

export default function Header() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img
          src="/assets/Logo.svg"
          alt="logo"
          onClick={() => {
            router.push('/', '/', {});
          }}
        />
        ;
      </div>
    </div>
  );
}
