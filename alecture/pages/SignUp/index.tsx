import useInput from '@hooks/useInput';
import React, { useCallback, useState } from 'react';
import axios from 'axios';
import fetcher from '@utils/fetcher';
import { Form, Error, Success, Label, Input, LinkContainer, Button, Header } from './styles';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

//* 함수 안에서랑 밖에서 변수를 선언하는것도 되게 중요한데.
//? 함수 밖 (즉 여기서) 변수를 선언해두면 다른곳에서 이 컴포넌트를
//! 쓰거나 할때 여기에 있는 변수가 전역변수가 되어버리기 때문
const SignUp = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  //! 위에는 커스텀훅, 밑에는 그냥 훅임. 2가지 비교를 위해
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  //? useState는 이전 값을 유지를 해주는 기능이 있어서 let 변수로 컨트롤 ㄴㄴ
  //* let 변수로 할 경우 글자 칠때마다 SignUp 함수 재실행되면서 let 변수도 초기화 되어서 항상 false유지
  //! 화면에 반영되는건 useState를 쓰고 아닌거는 useRef로 한다
  //? useCallback을 써야 성능 최적화가 됨, 계속 함수가 재생성되어서
  //? useCallback 이란게 캐싱(기억)을 하라는거임,
  //! 뒤에 []에서 하나라도 값이 바뀌는게 있을때까지
  //? 클래스에서는 필요 없는데 함수에서는 매번 전체가 재실행되기에, useCallback 안쓰면
  //? Signup이 실행되면서 함수들도 재생성 이걸 막으려고, 안 감싸면 리랜더링
  //! 리랜더링은 화면을 다시 그리는게 아님, 깜빡거리는거 그거 화면 다시 그리는게 아님
  //? 버추얼 검사임.
  //! ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
  // const onChangeEmail = useCallback((e) => {
  //   setEmail(e.target.value);
  // }, []);
  //! 커스텀 훅으로 인해 코멘트아웃
  // const onChangeNickname = useCallback((e) => {
  //   setNickname(e.target.value);
  // }, []);
  //! ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    //! e.target은 왜 []에 안 넣냐면, 여기 넣는건 함수 외부에 있는걸 넣는거라
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );
  //? 뒤에 []가 바뀌는게 있을때까지 함수 유지
  //? 뒤에 []가 바뀌는게 있으면 새로운 함수를 쓰고
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck);
      if (!mismatchError) {
        console.log('서버로 회원가입하기');
        setSignUpError(''); //! 초기화 한번 해주기, 연달아 클릭하는놈
        setSignUpSuccess(false);
        axios
          // .post('http://localhost:3095/api/users', {
          .post('/api/users', {
            email,
            nickname,
            password,
          })
          .then((response) => {
            console.log(response);
            setSignUpSuccess(true);
          })
          .catch((error) => {
            console.log(error.response);
            setSignUpError(error.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        {/* a href 하면 새로고침이 되어버림  */}
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
