import React, {useState, useEffect} from 'react';
import {FormControl, Select, InputLabel, MenuItem, makeStyles, TextField} from '@material-ui/core'
import ReactDOM from 'react-dom'
import parse from 'html-react-parser' //to delete
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
// to develop
// import {layoutStringParser} from '../utils/layoutWorker'

// export interface ILayout {
//     _id?: string,
//     name: string,
//     layout: string,
//     variables: string,
//     russian_name: string,
//     priority: number
// }

export interface IL_variable {
    varName: string,
    type: string,
    russian_varName: string
}

export interface ILayout {
    _id?: string,
    name: string,
    russian_name: string,
    layout: string,
    priority: number,
    variables: IL_variable[],
}

const useStyles = makeStyles((theme) => ({
    testClass: {
        minWidth: 120,
        margin: theme.spacing(2) 
    },
    selectHandler: {
        maxWidth: 400
    },
    textField: {
        maxWidth: 300,
        marginRight: 20,
        marginBottom: 15     
    },
    variablesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 15
    }
}))

function fetcher(url: string, setter: Function) {
    fetch(url)
        .then(res => res.json())
        .then(formattedData => setter(formattedData))
}



function findLayoutByName(layouts: ILayout[], name: string): number {
    let res: number = -1
    layouts.forEach((el, index) => {
        if (el.name === name) res = index
    })
    return res
}



export default function LayoutForm() {
    //useState and variables

    const [selectedLayout, setSelectedLayout] = useState<ILayout>({
        name: '',
        layout: '',
        variables: [],
        russian_name: '',
        priority: -1
    })

    const [variablesMap, setVariablesMap] = useState<Map<string, string>>(new Map())
    const updateMap = (k: string,v: any) => { //Change any to suitable types
        setVariablesMap(new Map(variablesMap.set(k,v)))
    }

    const [layouts, setLayouts] = useState<ILayout[]>([])
    
    const [sobaka, setSobaka] = useState('')

    const [formedLayout, setFormedLayout] = useState('');

    const handleChange = (ev: React.ChangeEvent<{ value: unknown }>) => {
        // clearValuesMap();
        const layoutIndex = findLayoutByName(layouts, ev.target.value as string)
        if (~layoutIndex) setSelectedLayout(layouts[layoutIndex])
    }

    const classes = useStyles();

    //useEffect

    useEffect(() => {
        fetcher('http://127.0.0.1:3000/layout/all', setLayouts)
        layouts.forEach(el => el.variables.forEach(el => updateMap(el.varName, '')))
    }, [])

    useEffect(() => {
        variablesMap.clear();
        layouts.forEach(el => el.variables.forEach(el => updateMap(el.varName, '')))
        console.log('here')

    }, [selectedLayout])

    useEffect(() => {
        let isMounted = true;
        if (layouts[0]) {
            console.log(layouts[0].name)
        }
        return () => {isMounted=false}    
    }, [layouts])

    // useEffect(() => {
    //     ReactDOM.render(React.createElement('div', {}, <TextField value = {selectedLayout.name} />), document.getElementById('test'))
    // }, [selectedLayout])
    
    //Methods

    const handleText = ( el: string, event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        updateMap(el, event.target.value);
        console.log('Updated Map')
    };

    function handleDateChange(el: string, date: Date|null) {
        updateMap()
    }
    
    function useField(el: IL_variable) {
        let field = <div>ErrorDIV</div>
        switch (el.type) {
            case 'date':
                field = <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker 
                            margin="normal"
                            label={el.russian_varName}
                            value={variablesMap.get(el.varName)}
                            onChange={() => {handleDateChange(el.varName, date)}}
                        />
                    </MuiPickersUtilsProvider>
                break;
            default: 
                field = <TextField 
                    label = {el.russian_varName} 
                    key = {el.varName} 
                    className = {`${classes.textField} layoutVariable`} 
                    inputProps={{className: 'test'}} 
                    variant='filled' 
                    value={variablesMap.get(el.varName)} 
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {handleText(el.varName, ev)}}
                />
        }
        return field
    }


    
    function makeLayout(id: string) {
        // let formEl = document.querySelector('#LayoutForm')
        // let data: any = [];
        // console.log(formEl ? formEl.querySelectorAll('input.test') : '')
        // if (formEl) formEl.querySelectorAll('input.test').forEach(el => data.push(el.getAttribute('value')));
        // console.log(data)
        // fetch(`http://127.0.0.1:3000/automaton/${id}`, {
        //     method: 'POST',
        //     body: JSON.stringify(data)
        // })
        //     .then(layout => layout.json())
        let data: any = [];
        for (const el of variablesMap.values()) {
            if (el) data.push(el)
        }
        console.log(data)
        
        fetch(`http://127.0.0.1:3000/automaton/${id}`, {
            method: 'POST',
            headers: { 
                    "Content-Type": "application/json",
                },
            body: JSON.stringify(data)
        })
        .then(layout => layout.text())
        .then(formedLayout => setFormedLayout(formedLayout))
        .catch(err => console.error(`Error in POST on /automaton/${id}: ${err}`))
    }

    return(
        <div>
            <FormControl className = {classes.testClass} id = "LayoutForm">
                
                    <InputLabel id = "selectHandler">Проблема</InputLabel>
                    <Select 
                        labelId="selectHandler"
                        value={selectedLayout.name}
                        onChange={handleChange}
                        className={classes.selectHandler}
                        autoWidth
                    >
                        {layouts && layouts.map(el => {
                            if (el){
                            return (<MenuItem key = {el.name} value={el.name}>{el.russian_name}</MenuItem>)
                            }
                        })}
                    </Select>
                    <div className={classes.variablesContainer}>
                        {selectedLayout.name && selectedLayout.variables.map(
                            el => useField(el)
                        )}
                    </div>
                    <button onClick={() => { selectedLayout._id ? makeLayout(selectedLayout._id) : alert(`Error in selectedLayout: id is undefined`); console.log(variablesMap) }}>Send data</button>
                    <div id="test">

                    </div>
                    {formedLayout && formedLayout}
            </FormControl>
        </div>
    )
}