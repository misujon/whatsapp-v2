import '../styles/globals.css';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from './login';
import Loading from '../components/Loading';
import firebase from 'firebase';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {

  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    
    if (user) {
      db.collection('users').doc(user.uid).set(
        {
          name: user.displayName,
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoUrl: user.photoURL,
        },
        { merge: true }
      );
    }

  }, [user])

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
