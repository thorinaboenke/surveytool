import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

function Header(props) {
  const loggedInPassed = typeof props.loggedIn !== 'undefined';
  const router = useRouter();

  return (
    <div>
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
            <li>
              <Link href="/logout">
                <a className="log">Log out</a>
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/login">
                <a className="log">Log in</a>
              </Link>
            </li>
          )}
        </ul>
      </header>
    </div>
  );
}

export default Header;
