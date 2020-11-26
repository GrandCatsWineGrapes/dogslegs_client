import {LayoutComposite, LeafString, LeafVariable, TOperator, Layout} from '../utils/BoilerPlateComposite'
import React, {useState, useEffect, ReactElement, FunctionComponent} from 'react';
import { InputLabel, TextField, Button, Select, Dialog, MenuItem, DialogTitle, DialogContent, FormControl } from '@material-ui/core';

import {BranchNode, LeafStrNode, LeafVarBuilder} from '../utils/Stringy'
import { add } from 'date-fns';

declare type TVarType = 'string' | 'date' | 'time' | 'boolean' | 'select';

import '../../styles/BoilerPlateCreator.scss'

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

interface ISelectInnerVars {
    handleInnerVariabs: (value: string, rusDesc: string) => void,
}

function SelectInnerVar(props: ISelectInnerVars) {
    const [value, setValue] = useState('');
    const [rusDesc, setRusDesc] = useState('');
   
    return (
        <React.Fragment>
            <h4>Inner vars for select</h4>
            <TextField
                label="Значение"
                value={value}
                onChange={(ev: React.ChangeEvent<{value: string}>)=>{setValue(ev.target.value)}}
            />
            :
            <TextField
                label="Краткое описание"
                value={rusDesc}
                onChange={(ev: React.ChangeEvent<{value: string}>)=>{setRusDesc(ev.target.value)}}
            />
            <button onClick = {() => {props.handleInnerVariabs(value, rusDesc)}}></button>
        </React.Fragment>
    )
}

function Variable({showVarDialog, onClose} : {showVarDialog: boolean, onClose: () => void}) {
    const [name, setName] = useState('');
    const [russianName, setRussianName] = useState('');
    const [type, setType] = useState<TVarType>('string');

    const [innerFields, setInnerFields] = useState<JSX.Element[]>([])

    const [innerVariabs, setInnerVariabs] = useState<any>({})

    const handleInnerVariabs = (value: string, rusDesc: string) => {
        setInnerVariabs({
            ...innerVariabs,
            value: rusDesc
        })
        
    }

    const types: TVarType[] = ['string','time','date','boolean','select']

    return (
        <Dialog
            onClose={onClose}
            open={showVarDialog}
            aria-labelledby="dialog-title"
        >
            <DialogTitle id="dialog-title">Описание переменной</DialogTitle>
            <DialogContent
                className="variabDialog"
            >
                 <div className="inputBlock">
                    <FormControl
                        className="innerField"
                    >
                        <InputLabel id="typeLabel">Тип переменной</InputLabel>
                        <Select

                            value={type}
                            labelId="typeLabel"
                            variant='filled'
                            onChange = {(ev: React.ChangeEvent<{value: unknown}>)=>{
                                setType(ev.target.value as TVarType)
                            }}
                            
                        >
                            {types.map(el => <MenuItem value={el}>{el}</MenuItem>)}
                        </Select>
                    </FormControl>
               
                    <TextField 
                        className="innerField"
                        label="Имя переменной"
                        value={name}
                        onChange={(ev: React.ChangeEvent<{value: string}>) => {setName(ev.target.value)}}
                    />
                    
                    <TextField
                        className="innerField"
                        label="Краткое описание (ru)"
                        value={russianName}
                        
                        onChange={(ev: React.ChangeEvent<{value: string}>) => {setRussianName(ev.target.value)}}
                    />

                    {type === 'select' && 
                        <React.Fragment>
                            <button onClick={()=>{setInnerFields([...innerFields, <SelectInnerVar handleInnerVariabs={handleInnerVariabs} />])}}>+</button>
                            {innerFields.map((el, index) => {
                                el.key=index
                                return el
                            })}    
                        </React.Fragment>
                    }
                </div>
                <Button color="primary" variant='contained' onClick={() => {}}>Add</Button>
            </DialogContent>
        </Dialog>
    )
}

export function LayoutComposer() {
    const [jsString, setJsString] = useState('')
    const [variabsString, setVariabsString] = useState('')
    const [russianName, setRussianName] = useState('')
    const [name, setName] = useState('');
    const [priority, setPriority] = useState(3);
    const [showVarDialog, setShowVarDialog] = useState(false);
    
    const stringHandler = (ev: React.ChangeEvent<{value: string}>) => {
        setJsString(ev.target.value)
    }

    const variabsHandler = (ev: React.ChangeEvent<{value: string}>) => {
        setVariabsString(ev.target.value)
    }

    const handleOpen = () => {
        setShowVarDialog(true)
    }

    const handleClose = () => {
        setShowVarDialog(false)
    }


    return (
        <React.Fragment>
            <Variable showVarDialog={showVarDialog} onClose={handleClose} />
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
            <div className="variabs_description">
                <button className="desc_add" onClick={handleOpen}>+</button>
                <p className="variabs_description"></p>
            </div>
        </React.Fragment>

    )
}