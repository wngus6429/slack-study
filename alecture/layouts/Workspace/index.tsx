import Menu from '@components/Menu';
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
  WorkspaceButton,
  AddButton,
  WorkspaceModal,
} from '@layouts/Workspace/styles';
import Modal from '@components/Modal';
import axios from 'axios';
import { IChannel, IUser } from 'typings/db';
import React, { VFC, useCallback, useState } from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { Redirect, useParams } from 'react-router';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import { Route, Link, Switch } from 'react-router-dom';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { toast } from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

// FC라는 타입안에 children이 들어있다.
// children 안 쓰는곳은 VFC 로 하면된다.
const Workspace: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const { workspace } = useParams<{ workspace: string }>();

  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초동안에는 useSWR로 위 URL을 아무리 많이 요청해도
    // 서버에는 딱 1번만 요청보내고 나머지는 첫번쨰 요청 성공에대한 그 데이터를 그대로 가져옴
    // (컴포넌트 수백개면 요청 수백개 보내는거 아니냐는 질문에 대한 답변)
  });
  // localhost 안 쓰는게 나중에 배포할때 좋다. 프록시로 한번에 ㄱㄱ
  const { data: channelData } = useSWR<IChannel[]>(
    // userData가 있을때에만 SWR 작동할수 있게끔
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  const { mutate: memberData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  const onLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true, //쿠키공유
      })
      .then((response) => {
        // 성공할거라고 생각해서 먼저 화면에 반영하고
        // 서버 처리는 나중에 함 OPTIMISTIC UI
        // 서버 처리 후 반영은 패시미스틱 UI (일반적으로 이거)
        // 여기 뒤에 true면 OPTIMISTIC이 된다. shouldRevalidate()
        console.log('리스폰', response);
        mutate(false, false);
        // mutate(response.data, false);
      });
  }, []);

  const onClickUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev); // 토글, 반전기능
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      // 띄어 쓰기도 막아야 해서 trim() 해줘야함
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          { withCredentials: true },
        )
        .then(() => {
          mutate();
          setShowCreateWorkspaceModal(false);
          // 인풋창 비우기
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch(() => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  //** 이 함수를 사요 */
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {}, []);

  if (userData === false) {
    console.log('data꾸에엑2', userData);
    return <Redirect to="/login" />;
  }

  if (!userData) return null;
  // 리턴 아래에 훅스들이 있으면 안된다
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg
              src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })}
              alt={userData.nickname}
            ></ProfileImg>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
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
        <Workspaces>
          {userData?.Workspaces?.map((ws) => {
            return (
              // Link는 a 태그 대체. 리액트에서는
              <Link key={ws.id} to={`/workspace/${123}/channel/`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}></AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {/* <ChannelList userData={userData} /> */}
            <DMList userData={userData} />
            {/* 없을수도 있다는 ? 하기 */}
            {channelData?.map((v) => {
              return <div>{v.name}</div>;
            })}
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            {/* workspace 안에 있더라도 path를 이런식으로 적어야함 */}
            {/* 주소가 일관성있게 계층적이면 레이아웃 자체에서 판단해서 route */}
            {/* 만약 주소가 /sw/dm 이런식이면 안됨 */}
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      {/* input이 있는 컴포넌트는 따로 만드는게 리랜더링할떄 좋다. */}
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </div>
  );
};

export default Workspace;
