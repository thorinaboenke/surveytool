import React from 'react';
import Header from './Header';

function Layout(props) {
  return (
    <div>
      <Header loggedIn={props.loggedIn} user={props.user} />
      <main>{props.children}</main>
    </div>
  );
}

export default Layout;
