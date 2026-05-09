import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

export default function NotFoundContent({ className }) {

  return (
    <main className={clsx(styles.wrapper, className)}>

      <div className={styles.window}>

        <div className={styles.titleBar}>
          system://router/error
        </div>

        <div className={styles.monitor}>

          <div className={styles.screen}>

            <div className={styles.face}>
              ×_×
            </div>

            <h1 className={styles.code}>
              404
            </h1>

            <p className={styles.title}>
              ROUTE NOT FOUND
            </p>

            <div className={styles.logs}>
              <p>[ERROR] requested route does not exist.</p>
              <p>[SYSTEM] runtime navigation failed.</p>
            </div>

            <Link
              to="/"
              className={styles.button}
            >
              return_home()
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}