import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'

import MainApp from 'containers/MainApp'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <MainApp />
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
