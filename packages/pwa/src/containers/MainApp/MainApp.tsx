import { Route, Switch } from 'react-router-dom'
import React from 'react'

import Home from 'containers/Home'
import Login from 'containers/Login'
import LoginCallback from 'containers/LoginCallback'
import Logout from 'containers/Logout'

const MainApp: React.FC = () => (
    <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/logout" component={Logout} exact />
        <Route path="/login/callback" component={LoginCallback} />
        <Route path="/" component={Home} />
    </Switch>
)

export default MainApp
