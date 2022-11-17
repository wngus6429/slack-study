// import EachDM from '@components/EachDM';
// import useSocket from '@hooks/useSocket';
import { CollapseButton } from '@components/DMList/styles';
import { IDM, IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

interface Props {
  userData?: IUser;
}

const DMList = ({ userData }: Props) => {
  const { workspace } = useParams<{ workspace?: string }>();

  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  //   const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  // key는 아무 문자열이나 다 되고 value는 숫자라는 겁니다. 'abc': 3 같은 것요.
  // 두 번째는 숫자의 배열이라는 겁니다. [123, 45] 같은 것요.
  const [countList, setCountList] = useState<{ [key: string]: number }>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const resetCount = useCallback(
    (id) => () => {
      setCountList((list) => {
        return {
          ...list,
          [id]: 0,
        };
      });
    },
    [],
  );

  const onMessage = (data: IDM) => {
    console.log('dm왓다', data);
    setCountList((list) => {
      return {
        ...list,
        [data.SenderId]: list[data.SenderId] ? list[data.SenderId] + 1 : 1,
      };
    });
  };

  useEffect(() => {
    console.log('DMList:workspace 바꼈다', workspace);
    setOnlineList([]);
    setCountList({});
  }, [workspace]);

  //   useEffect(() => {
  //     console.log('DMList: workspace 바꼈다', workspace);
  //     setOnlineList([]);
  //   }, [workspace]);

  //   useEffect(() => {
  //     socket?.on('onlineList', (data: number[]) => {
  //       setOnlineList(data);
  //     });
  //     console.log('socket on dm', socket?.hasListeners('dm'), socket);
  //     return () => {
  //       console.log('socket off dm', socket?.hasListeners('dm'));
  //       socket?.off('onlineList');
  //     };
  //   }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default DMList;
