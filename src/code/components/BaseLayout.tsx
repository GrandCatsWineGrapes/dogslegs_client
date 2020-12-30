import {createMuiTheme} from '@material-ui/core'
import React, {useState} from 'react';
import {BrowserRouter as BRouter, HashRouter as HRouter, Switch, Route} from 'react-router-dom'
import LayoutForm from './BoilerPlateForm'
import LeftSideMenu from './LeftSideMenu';


import 'normalize.css'
import '../../styles/main.scss'
import { LayoutComposer } from './BoilerPlateCreator';


export function BaseLayout() {
    console.log('render')
    return (
        <div id="app">
            <div className="main-wrapper">
                <HRouter>
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
                                Placeholder newlayout
                            </Route>
                            <Route path="/test">
                                <h3>BoilerPlate creator:</h3>
                                <LayoutComposer />
                            </Route>
                        </Switch>
                    </div>
                </HRouter>
            </div>
        </div>
    )
}