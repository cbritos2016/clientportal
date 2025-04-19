import '../styles/globals.css';
import Nav from '../components/Nav';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token && !publicPaths.includes(router.pathname)) {
      router.push('/login');
    }
  }, [router.pathname]);

  return (
    <>
      <Nav />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;