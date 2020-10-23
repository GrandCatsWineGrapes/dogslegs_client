import {createMuiTheme} from '@material-ui/core'
import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import LayoutForm from './LayoutForm'
import LeftSideMenu from './LeftSideMenu';


import 'normalize.css'
import '../../styles/main.scss'
import { LayoutComposer } from './LayoutCreator';


export function BaseLayout() {
    console.log('render')
    return (
        <div id="app">
            <div className="main-wrapper">
                <Router>
                    <div className="ls-menu">
                        <LeftSideMenu />
                    </div>
                    <div className="content">
                        <Switch>
                            <Route path="/" exact>
                                Placeholder Home
                            </Route>
                            <Route path="/layoutmaker">
                                <LayoutForm/>
                            </Route>
                            <Route path="/newlayout">
                                Placeolder newlayout
                            </Route>
                            <Route path="/test">
                                <h1>Tests for now:</h1>
                                <h3>Layout composite:</h3>
                                <LayoutComposer />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        </div>
    )
}