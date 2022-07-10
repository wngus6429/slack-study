import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LogIn from '@pages/Login';
import SignUp from '@pages/SignUp';

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
