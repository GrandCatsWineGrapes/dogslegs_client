import React, {useState} from 'react';
import LayoutForm from './LayoutForm'

import 'normalize.css'
import '../../styles/main.scss'

export function BaseLayout() {

    return (
        <div id="app">
            <div className="main-wrapper">
                <div className="ls-menu">
                    test
                </div>
                <div className="content">
                    <LayoutForm/>
                </div>
            </div>
        </div>
    )
}