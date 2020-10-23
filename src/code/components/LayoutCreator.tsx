import {LayoutComposite, LeafString, LeafVariable, TOperator, Layout} from '../utils/LayoutComposite'
import React, {useState, useEffect, ReactElement, FunctionComponent} from 'react';
import { InputLabel, TextField, Button } from '@material-ui/core';

import {BranchNode, LeafStrNode, LeafVarBuilder} from '../utils/Stringy'
import { add } from 'date-fns';

import '../../styles/LayoutCreator.scss'

import hljs from 'highlight.js'

function formData(name: string, russian_name: string, variables: string, layoutString: string) {
    return {
        name,
        russian_name,
        variables: JSON.parse(`[${variables}]`),
        layout: `\`${layoutString}\``,
        priority: 3
    }
}


function toDbDirectly(data: any) {
    try {
        fetch('http://127.0.0.1:3000/layout', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => console.log(json))
    } catch(err) {
        console.error(err)
    }
}

export function LayoutComposer() {
    const [jsString, setJsString] = useState('')
    const [variabsString, setVariabsString] = useState('')
    const [russianName, setRussianName] = useState('')
    const [name, setName] = useState('');
    const [priority, setPriority] = useState(3);
    
    const stringHandler = (ev: React.ChangeEvent<{value: string}>) => {
        setJsString(ev.target.value)
    }

    const variabsHandler = (ev: React.ChangeEvent<{value: string}>) => {
        setVariabsString(ev.target.value)
    }


    return (
        <div id="codenode">
            <TextField
                label="Имя шаблона (eng.)"
                onChange={(ev: React.ChangeEvent<{value: string}>)=>{setName(ev.target.value)}}
                value={name}
                className="layoutInfo"
            ></TextField>
            <TextField
                label="Имя шаблона (rus.)"
                onChange={(ev: React.ChangeEvent<{value: string}>)=>{setRussianName(ev.target.value)}}
                value={russianName}
                className="layoutInfo"
            ></TextField>
            <TextField
                label="lobster"
                multiline
                rows="10"
                value={jsString}
                onChange={stringHandler}
                className="codefield"
                variant="outlined"
            ></TextField>
            <div />
            <TextField
                label="Test"
                multiline
                rows="10"
                value={variabsString}
                onChange={variabsHandler}
                className="codefield"
                variant="outlined"
            ></TextField>
            <Button 
                variant="contained" 
                color="primary"
                className="submit"
                onClick={() => {toDbDirectly(formData(name, russianName, variabsString, jsString))}}
            >
                Send
            </Button>
            <p className="varStructureHint">
                {'{\n\n"varName":"who_chooser",\n                "type":"select",\n                "russian_varName":"Кто сообщил?",\n                "innerVars":{\n                    "foo":"bar",\n                    "foz":"baz"\n                }\n            }'}
            </p>
        </div>
    )
}