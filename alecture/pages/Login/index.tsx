import useInput from '@hooks/useInput';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  // fetcher 함수가 이 주소를 어떻게 처리 할 것인가.
  // 내가 원할때 호출하기 revalidate ㅋㅋ
  // 로그인 성공하면 revalidate(), data가 false 였다가 데이터가 들어가면서
  // 리랜더링이 되고, 밑에 if(data)
  // 밑에 data나 error의 값이 바뀌면 알아서 컴포넌트가 리랜더링
  // mutate는 서버에 요청 안보내고 데이터를 수정함.
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  // const { data, error, revalidate, mutate } = useSWR('/api/users', fetcher);

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        // .post('/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          mutate(response.data);
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );
  // 이거 해주는 이유는 화면 깜빡임 떄문에
  if (data === undefined) {
    return <div>로딩중...</div>;
  }
  console.log('로그인완료', data);

  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
