//firebaseMiddleware.js

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig.js';

const firebaseMiddleware = store => next => async action => {
  if (action.type === 'auth/login') {
    const { email, password } = action.payload;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      store.dispatch({ type: 'auth/loginSuccess' });
    } catch (error) {
      store.dispatch({ type: 'auth/loginError', payload: error.message });
    }
  }
  return next(action);
};

export default firebaseMiddleware;
