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
  ProfileModal,
  LogOutButton,
} from '@layouts/Workspace/styles';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { Redirect, Switch } from 'react-router';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import { Route } from 'react-router-dom';
import Menu from '@components/Menu';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

// FC라는 타입안에 children이 들어있다.
// children 안 쓰는곳은 VFC 로 하면된다.
const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev); // 토글, 반전기능
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
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(data.nickname, { s: '28px', d: 'retro' })} alt={data.nickname}></ProfileImg>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(data.nickname, { s: '36px', d: 'retro' })} alt={data.nickname} />
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            {/* workspace 안에 있더라도 path를 이런식으로 적어야함 */}
            {/* 주소가 일관성있게 계층적이면 레이아웃 자체에서 판단해서 route */}
            {/* 만약 주소가 /sw/dm 이런식이면 안됨 */}
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
