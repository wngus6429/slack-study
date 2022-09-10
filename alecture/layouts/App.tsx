import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/Login'));

const SignUp = loadable(() => import('@pages/SignUp'));
const App = () => {
  return (
    <Switch>
      {/* Switch는 딱 하나만 화면에 표시 */}
      {/* Route는 컴포넌트를 표시하고, Redirect는 페이지 변경 */}
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
};

export default App;
