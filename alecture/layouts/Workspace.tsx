import { Button } from '@pages/SignUp/styles';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { Redirect } from 'react-router';

// FC라는 타입안에 children이 들어있다.
// children 안 쓰는곳은 VFC 로 하면된다.
const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true, //쿠키공유
      })
      .then(() => {
        mutate();
      });
  }, []);

  if (data === false) {
    console.log('data꾸에엑2', data);
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Button onClick={onLogout}>로그아웃</Button>
      {children}
    </div>
  );
};

export default Workspace;
