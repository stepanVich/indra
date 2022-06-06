import fetchService from 'app/indra/services/fetch';
import {useStoreActions} from 'easy-peasy';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import './loginPage.css';

async function loginUser(credentials: any) {
  try {
    return await fetchService.post(process.env.REACT_APP_API_URL_INDRA + '/login', credentials).then((json: any) => {
      return json;
    });
  } catch (e) {
    console.log('Login failed: ' + e);
  }
}

const useMountedState = () => {
  const mountedRef = useRef(false);
  const isMounted = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return isMounted;
};

const Login = () => {
  const [username, setUserName] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [failed, setFailed] = useState<boolean>();

  const setToken = useStoreActions((actions: any) => actions.setToken);

  const isMounted = useMountedState();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    loginUser({
      user: username,
      password: password
    }).then((token) => {
      if (!isMounted()) {
        return;
      }
      if (token) {
        setToken(token);
        setFailed(false);
      } else {
        setFailed(true);
      }
    });
  };


  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
        </label>
        <div className="login-button">
          <button type="submit">Submit</button>
        </div>
      </form>
      <h3 className="login-failed">{failed ? 'Login failed' : ''}</h3>
    </div>
  );
};

export default Login;
