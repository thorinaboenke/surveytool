import { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import Head from 'next/head';
import nextCookies from 'next-cookies';
import { useRouter } from 'next/router';
import { isSessionTokenValid } from '../util/auth';

export default function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const usernameInput = useRef(null);

  useEffect(() => {
    usernameInput.current.focus();
  }, []);

  const router = useRouter();

  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>Login</title>
      </Head>
      <div className="login">
        <div className="container">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
              });
              const { success } = await response.json();

              if (!success) {
                setErrorMessage('Login failed');
              } else {
                setErrorMessage('');
                router.push(props.redirectDestination);
              }
            }}
          >
            <div>
              Don't have an account?{' '}
              <Link href="/signup">
                <a>Register here</a>
              </Link>
            </div>
            <div>Login</div>
            <label htmlFor="username">
              {' '}
              Username
              <input
                ref={usernameInput}
                value={username}
                id="username"
                type="text"
                onChange={(e) => setUsername(e.currentTarget.value)}
                maxLength={22}
              />
            </label>
            <br />
            <label htmlFor="password">
              {' '}
              Password
              <input
                value={password}
                id="password"
                type="password"
                onChange={(e) => setPassword(e.currentTarget.value)}
                maxLength={22}
              />
            </label>
            <button type="submit">LOG IN</button>
            {errorMessage && <div className="error">{errorMessage}</div>}
          </form>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { session: token } = nextCookies(context);

  const redirectDestination = context?.query?.returnTo ?? '/dashboard';
  const logged = await isSessionTokenValid(token);
  if (logged) {
    return {
      redirect: {
        destination: redirectDestination,
        permanent: false,
      },
    };
  }

  return {
    props: {
      loggedIn: false,
      redirectDestination: redirectDestination,
    },
  };
}
