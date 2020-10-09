import 'date-fns'
import {format} from 'date-fns'
import ruLocale from "date-fns/locale/ru";
import React, {useState, useEffect} from 'react';
import {
    FormControl,
    FormControlLabel, 
    Select, 
    InputLabel, 
    MenuItem, 
    makeStyles, 
    TextField,
    Switch
} from '@material-ui/core'
import ReactDOM from 'react-dom'
import parse from 'html-react-parser' //to delete
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
} from '@material-ui/pickers';
import { FlipRounded } from '@material-ui/icons';
import { datePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';

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

export interface IInnerVars {
    [key: string]: string
}

export interface IL_variable {
    varName: string,
    type: string,
    russian_varName: string,
    innerVars?: IInnerVars
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
        marginBottom: 15,
        marginTop: 0
    },
    variablesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 15
    },
    selectField: {
        maxWidth: 400,
        minWidth: 200,
        marginRight: 20,
        marginBottom: 15,
    },
    multiRow: {
        minWidth: 600
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

function isDate(input: any) {
    if (Object.prototype.toString.call(input) === "[object Date]")
        return true
    return false
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

    const [variablesMap, setVariablesMap] = useState<Map<string, any>>(new Map())
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

    const checkTimes = (type: string) => {
        switch (type) {
            case 'time':
                const time_start = variablesMap.get('time_start')
                const time_end = variablesMap.get('time_end');
                if (time_end && time_start)
                    if (time_end<time_start) return false
                        else return true
                    else return true
                break;
            case 'date':
                const date_start = variablesMap.get('date_start')
                const date_end = variablesMap.get('date_end');
                if (date_end && date_start)
                    if (date_end<date_start) return false
                        else return true
                    else return true
                break;
            default: 
                throw new Error(`Incorrect type while checking time`)
        }
    }

    const classes = useStyles();

    //useEffect

    useEffect(() => {
        fetcher('http://127.0.0.1:3000/layout/all', setLayouts)
        layouts.forEach(el => el.variables.forEach(el => {
            switch (el.type) {
                case 'date':
                    updateMap(el.varName, new Date())
                    break;
                case 'time': 
                    updateMap(el.varName, new Date())
                    break;
                case 'string': 
                    updateMap(el.varName, '')
                    break;
                case 'boolean':
                    updateMap(el.varName, null)
                    break;
                case 'number':
                    updateMap(el.varName, 0)
                    break;
                case 'select':
                    updateMap(el.varName, [])
                    break;

            }

        }))
    }, [])

    useEffect(() => {
        variablesMap.clear();
        layouts.forEach(el => el.variables.forEach(el => {
            switch (el.type) {
                case 'date':
                    updateMap(el.varName, new Date())
                    break;
                case 'time':
                    updateMap(el.varName, new Date());
                    break;
                case 'string': 
                    updateMap(el.varName, '')
                    break;
                case 'boolean':
                    updateMap(el.varName, null)
                    break;
                case 'number':
                    updateMap(el.varName, 0)
                    break;
                case 'select':
                    updateMap(el.varName, '')
                    break;
            }

        }))

    }, [selectedLayout])

    useEffect(() => {
        // let isMounted = true;
        if (layouts[0]) {
            console.log(layouts[0].name)
        }
        // return () => {isMounted=false}    
    }, [layouts])

    // useEffect(() => {
    //     ReactDOM.render(React.createElement('div', {}, <TextField value = {selectedLayout.name} />), document.getElementById('test'))
    // }, [selectedLayout])
    
    //Methods

    const handleText = ( el: string, event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        updateMap(el, event.target.value);
    };

    function handleDateChange(el: string, date: Date|null) {
        updateMap(el, date)
    }

    function handleSwitch(el: string, event: React.ChangeEvent<HTMLInputElement>) {
        updateMap(el, event.target.checked);
    }

    function useMenuItems(fields: IInnerVars|undefined) {
        let menuItemsArray = []
        let key: string;
        if (fields) {
            for(key in fields) {
                menuItemsArray.push(<MenuItem 
                    value = {key}
                    key = {key}>
                        {fields[key] && fields[key]}
                </MenuItem>)
            }
        }
        return menuItemsArray
    }
    
    function useField(el: IL_variable) {
        let field = <div>ErrorDIV</div>
        switch (el.type) {
            case 'date':
                field = <MuiPickersUtilsProvider key={el.varName} utils={DateFnsUtils} locale={ruLocale}>
                            <KeyboardDatePicker 
                                // clearable
                                error={!checkTimes('date')}
                                minDate = {new Date(2000, 1, 1)}
                                margin="none"
                                label={el.russian_varName}
                                value={variablesMap.get(el.varName) || null}
                                onChange={(date) => {handleDateChange(el.varName, date)}}
                                className = {`${classes.textField} layoutVariable`} 
                                inputVariant = "filled"
                                variant = "inline"
                                inputProps={{className: 'test'}} 
                                format="dd.MM.yyyy"
                            />
                        </MuiPickersUtilsProvider>
                break;
            case 'time': 
                field = <MuiPickersUtilsProvider key={el.varName} utils={DateFnsUtils} locale={ruLocale}>
                            <KeyboardTimePicker
                                error={!checkTimes('time')}
                                key={el.varName}
                                format="HH:mm"
                                label = {el.russian_varName}
                                value = {variablesMap.get(el.varName) || null}
                                onChange = {(time) => handleDateChange(el.varName, time)}
                                placeholder="06:00"
                                ampm={false}
                                variant="inline"
                                inputVariant="filled"
                                inputProps={{className: 'test'}}
                                className = {`${classes.textField} layoutVariable`} 
                            />
                        </MuiPickersUtilsProvider>
                        break;
            case 'boolean':
                field = <React.Fragment key ={el.varName}></React.Fragment>
                const switchEl = <FormControlLabel key = {el.varName}
                        control = {
                            <Switch
                                checked={variablesMap.get(el.varName) || false}
                                name={el.varName}
                                onChange={(state) => {handleSwitch(el.varName, state)}}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />}
                label = {el.russian_varName}
                />
                ReactDOM.render(switchEl, document.getElementById('check'));
                
                break;
            case 'select':
                field=
                    <FormControl key={el.varName}>
                        <InputLabel id={el.varName}>{el.russian_varName}</InputLabel>
                        <Select
                                labelId={el.varName}
                                value=""
                                className={classes.selectField}
                                autoWidth
                                variant="filled"
                        >
                            {el.innerVars && useMenuItems(el.innerVars)}
                        </Select>
                    </FormControl>
                break;
            default: 
                field = <TextField 
                    label = {el.russian_varName} 
                    key = {el.varName} 
                    className = {`${classes.textField} layoutVariable`} 
                    inputProps={{className: 'test'}} 
                    variant='filled' 
                    value={variablesMap.get(el.varName) || ''} 
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {handleText(el.varName, ev)}}
                />
        }
        return field
    }


    
    function makeLayout(id: string) {
        let data: any = [];
        
        for (const key of selectedLayout.variables) {
            let el = variablesMap.get(key.varName)
            switch (key.type) {
                case 'date':
                    data.push(format(el, 'dd.MM.yyyy'));
                    break;
                case 'time':
                    data.push(format(el, 'HH:mm'))
                    break;
                default:
                    data.push(el)
            }
               
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
                </FormControl>
                <div className={classes.variablesContainer}>
                    {selectedLayout.name && selectedLayout.variables.map(
                        el => useField(el)
                    )}
                </div>
                <div id="check"></div>
                <button onClick={() => { selectedLayout._id ? makeLayout(selectedLayout._id) : alert(`Error in selectedLayout: id is undefined`); console.log(variablesMap) }}>Send data</button>
                <div id="test">

                </div>
                {formedLayout &&    
                    <TextField
                        label="Сформированный шаблон"
                        multiline
                        value={formedLayout}
                        variant="filled"
                        className={classes.multiRow}
                    >
                    </TextField>}
        </div>
    )
}