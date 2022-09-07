import React, { useCallback, useState } from 'react';
import { Form, Error, Label, Input, LinkContainer, Button, Header } from './style';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [mismatchError, setMismatchError] = useState(false);
  // useCallback을 써야 성능 최적화가 됨, 계속 함수가 재생성되어서
  // useCallback 이란게 캐싱(기억)을 하라는거임,
  // 뒤에 []에서 하나라도 값이 바뀌는게 있을때까지
  // 클래스에서는 필요 없는데 함수에서는 매번 전체가 재실행되기에, useCallback 안쓰면
  // Signup이 실행되면서 함수들도 재생성 이걸 막으려고, 안 감싸면 리랜더링
  // 리랜더링은 화면을 다시 그리는게 아님, 깜빡거리는거 그거 화면 다시 그리는게 아님
  // 버추얼 검사임.
  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    // e.target은 왜 []에 안 넣냐면, 여기 넣는건 함수 외부에 있는걸 넣는거라
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );
  // 뒤에 []가 바뀌는게 있을때까지 함수 유지
  // 뒤에 []가 바뀌는게 있으면 새로운 함수를 쓰고
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck);
      if (!mismatchError) {
        console.log('서버로 회원가입하기');
      }
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );

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
          {/*{signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>} */}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        {/* <Link to="/login">로그인 하러가기</Link> */}
      </LinkContainer>
    </div>
  );
};

export default SignUp;
