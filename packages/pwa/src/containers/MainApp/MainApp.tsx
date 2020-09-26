import { Route, Switch } from 'react-router-dom'
import React from 'react'

import Home from 'containers/Home'
import Login from 'containers/Login'

const MainApp: React.FC = () => (
    <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
    </Switch>
)

export default MainApp
