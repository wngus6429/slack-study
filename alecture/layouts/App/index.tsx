import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

//코드스플리팅
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      {/* Switch는 딱 하나만 화면에 표시, 위에서부터 아래로 찾음 */}
      {/* Route는 컴포넌트를 표시하고, Redirect는 페이지 변경 */}
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      {/* :는 사용자가 자유롭게 값을 바꿀수 있음 (와일드카드 라고 함, 혹은 라우트 파라미터) */}
      {/* 예를들어 workspace/sleack가 있으면 라우트파라미터 위에 적어줘야함, 아니면 아래로 안감 */}
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
};

export default App;
