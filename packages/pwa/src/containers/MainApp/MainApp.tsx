import { Route, Switch } from 'react-router-dom'
import React from 'react'

import Home from 'containers/Home'
import Login from 'containers/Login'
import LoginCallback from 'containers/LoginCallback'
import Logout from 'containers/Logout'
import ReleaseEmotion from 'containers/ReleaseEmotion'

const MainApp: React.FC = () => (
    <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/logout" component={Logout} exact />
        <Route path="/login/callback" component={LoginCallback} />
        <Route path="/release-emotion" component={ReleaseEmotion} />
        <Route path="/" component={Home} />
    </Switch>
)

export default MainApp
