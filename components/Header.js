import Link from 'next/link';
import React from 'react';
import { jsx } from '@emotion/react';
import { colors } from '../util/colors';
import { useRouter } from 'next/router';

function Header(props) {
  const loggedInPassed = typeof props.loggedIn !== 'undefined';
  const router = useRouter();
  const user = props.user;

  const headerStyles = jsx`
    .header li {
    }

    .header li:hover {
    }
  `;

  return (
    <div css={headerStyles}>
      <header className="header">
        <ul className="menu">
          <li>
            {' '}
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            {' '}
            <Link href="/dashboard">
              <a>Dashboard</a>
            </Link>
          </li>
          {!loggedInPassed ||
          router.pathname === '/login' ? null : props.loggedIn ? (
            <>
              <div>Logged in as {user.username}</div>
              <li>
                <Link href="/logout">
                  <a className="log">Log out</a>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">
                <a data-cy="header-link-login" className="log">
                  Log in
                </a>
              </Link>
            </li>
          )}
        </ul>
      </header>
    </div>
  );
}

export default Header;
