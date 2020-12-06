import Head from 'next/head';
import Link from 'next/link';

export default function Thankyou() {
  return (
    <>
      <Head>
        <title>SurveyTool - Thank you for participating</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex">
        <div>Thank you for participating!</div>
        <div>
          <Link href="/signup">
            <a>Click here to make your own survey </a>
          </Link>
        </div>
      </div>
    </>
  );
}
