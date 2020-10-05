import React, {useState, useEffect} from 'react';
import {FormControl, Select, InputLabel, MenuItem, makeStyles, TextField} from '@material-ui/core'
import ReactDOM from 'react-dom'
import parse from 'html-react-parser' //to delete
// to develop
// import {layoutStringParser} from '../utils/layoutWorker'

export interface ILayout {
    _id?: string,
    name: string,
    layout: string,
    variables: string,
    russian_name: string,
    priority: number
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
        maxWidth: 150,
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
        .then()
}

function makeLayout() {
    let formEl = document.querySelector('#LayoutForm')
    let data: any = [];
    console.log(formEl ? formEl.querySelectorAll('input.test') : '')
    if (formEl) formEl.querySelectorAll('input.test').forEach(el => data.push(el.getAttribute('value')));
    console.log(data)
    // fetch(`http://127.0.0.1:3000/automaton/${id}`, {
    //     method: 'POST',
    //     body: JSON.stringify(data)
    // })
    //     .then(layout => layout.json())
}


function findLayoutByName(layouts: ILayout[], name: string): number {
    let res: number = -1
    layouts.forEach((el, index) => {
        if (el.name === name) res = index
    })
    return res
}

export default function LayoutForm() {
    const [selectedLayout, setSelectedLayout] = useState<ILayout>({
        name: '',
        layout: '',
        variables: '',
        russian_name: '',
        priority: -1
    })
    const [layouts, setLayouts] = useState<ILayout[]>([])
    
    const [sobaka, setSobaka] = useState('')

    const handleChange = (ev: React.ChangeEvent<{ value: unknown }>) => {
        const layoutIndex = findLayoutByName(layouts, ev.target.value as string)
        if (~layoutIndex) setSelectedLayout(layouts[layoutIndex])
    }

    const classes = useStyles();


    useEffect(() => {
        fetcher('http://127.0.0.1:3000/layout/all', setLayouts)
        
    }, [])

    useEffect(() => {
        let isMounted = true;
        if (layouts[0]) {
            console.log(layouts[0].name)
        }
        return () => {isMounted=false}    
    }, [layouts])

    useEffect(() => {
        ReactDOM.render(React.createElement('div', {}, <TextField value = {selectedLayout.name} />), document.getElementById('test'))
    }, [selectedLayout])

    const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSobaka(event.target.value);
      };

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
                        {selectedLayout.name && selectedLayout.variables.split(', ').map(
                            el => <TextField label = {el} key = {el} className = {`${classes.textField} layoutVariable`} inputProps={{className: 'test'}} variant='filled' value={sobaka} onChange={handleText}/>
                        )}
                    </div>
                    <button onClick={() => { makeLayout() }}>Send data</button>
                    <div id="test">

                    </div>
            </FormControl>
        </div>
    )
}