import {
  Header,
  RightMenu,
  ProfileImg,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  WorkspaceName,
  Chats,
  MenuScroll,
} from '@layouts/Workspace/styles';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { Redirect } from 'react-router';
import gravatar from 'gravatar';

// FC라는 타입안에 children이 들어있다.
// children 안 쓰는곳은 VFC 로 하면된다.
const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000, // 2초동안에는 useSWR로 위 URL을 아무리 많이 요청해도
    // 서버에는 딱 1번만 요청보내고 나머지는 첫번쨰 요청 성공에대한 그 데이터를 그대로 가져옴
    // (컴포넌트 수백개면 요청 수백개 보내는거 아니냐는 질문에 대한 답변)
  });
  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true, //쿠키공유
      })
      .then((response) => {
        // 성공할거라고 생각해서 먼저 화면에 반영하고
        // 서버 처리는 나중에 함 OPTIMISTIC UI
        // 서버 처리 후 반영은 패시미스틱 UI (일반적으로 이거)
        // 여기 뒤에 true면 OPTIMISTIC이 된다. shouldRevalidate()
        console.log('리스폰', response);
        mutate(false);
        // mutate(response.data, false);
      });
  }, []);
  console.log('로그아웃후', data);
  if (data === false) {
    console.log('data꾸에엑2', data);
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.nickname, { s: '28px', d: 'retro' })} alt={data.ni}></ProfileImg>
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default Workspace;
