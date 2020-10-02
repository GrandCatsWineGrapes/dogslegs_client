import React, {useState} from 'react';
import LayoutForm from './LayoutForm'

import 'normalize.css'
import '../../styles/main.scss'

export function BaseLayout() {

    return (
        <div id="app">
            <LayoutForm/>
        </div>
    )
}