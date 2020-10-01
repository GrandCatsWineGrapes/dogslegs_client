import React, {useState} from 'react';
import LayoutForm from './LayoutForm'

import 'normalize.css'

export function BaseLayout() {

    return (
        <div id="app">
            <LayoutForm/>
        </div>
    )
}