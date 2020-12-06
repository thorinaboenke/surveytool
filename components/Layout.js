import Link from 'next/link';
import React from 'react';
import Header from './Header';
import { jsx } from '@emotion/react';
import { colors } from '../util/colors';
import styles from '../styles/Home.module.css';

function Layout(props) {
  return (
    <div>
      <Header loggedIn={props.loggedIn} user={props.user} />
      <main className={styles.main}>{props.children}</main>
    </div>
  );
}

export default Layout;
