import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  //! :workspace :channel 같은 주소의 값을 가져올수 있다.
  //! 주소가 데이터의 역할을 하고 있는거지, 이거 안쓰면 또 상태관리 해야해서 개빡침
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000, // 2초동안에는 useSWR로 위 URL을 아무리 많이 요청해도
    // 서버에는 딱 1번만 요청보내고 나머지는 첫번쨰 요청 성공에대한 그 데이터를 그대로 가져옴
    // (컴포넌트 수백개면 요청 수백개 보내는거 아니냐는 질문에 대한 답변)
  });
  const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
    // userData가 있을때에만 SWR 작동할수 있게끔
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );
  console.log('워크', workspace);
  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      // withCredentail 로 누가 보내는건지는 암,
      // 어떤 워크스페이스에 생성하는지, 주소로 알아냄, useparams
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          { withCredentials: true },
        )
        .then(() => {
          setShowCreateChannelModal(false);
          mutateChannel(); // 채널리스트 다시 불러오기
          setNewChannel('');
        })
        .catch((error) => {
          console.dir('채널 생성 에러', error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [workspace, newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
