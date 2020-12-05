import Link from 'next/link';
import React from 'react';
import Header from './Header';
import { jsx } from '@emotion/react';
import { colors } from '../util/colors';

function Layout(props) {
  return (
    <div>
      <Header loggedIn={props.loggedIn} user={props.user} />
      <main>{props.children}</main>
    </div>
  );
}

export default Layout;
