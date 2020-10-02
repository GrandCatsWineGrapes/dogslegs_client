import React, {useState, useEffect} from 'react';
import {FormControl, Select, InputLabel, MenuItem, makeStyles, TextField} from '@material-ui/core'
import ReactDOM from 'react-dom'
import parse from 'html-react-parser'

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

function layoutStringParser(layoutString: string) {
    // console.log(layoutString)
    const arrayFromLayoutString = layoutString.split('');
    let isVariableSpace: boolean = false
    let toSliceIndexes: number[] = [];
    arrayFromLayoutString.forEach((el, index) => {
        if (el === '$' && arrayFromLayoutString[index+1] === '{') {
            isVariableSpace = true;
            toSliceIndexes.push(index)
        }
        if (el === '}' && isVariableSpace) {
            isVariableSpace = false;
            toSliceIndexes.push(index)
        }
    })
    
    let toSliceStrings: string[] = []
    for(let i = 0; i<toSliceIndexes.length; i+=2) {
        toSliceStrings.push(layoutString.slice(toSliceIndexes[i], toSliceIndexes[i+1]+1))
    }

    // toSliceStrings.forEach(el => layoutString = layoutString.replace(el, '|||'))
    // layoutString = layoutString.replace('`', '')
    
    return parse(layoutString)

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
    
    const handleChange = (ev: React.ChangeEvent<{ value: unknown }>) => {
        const layoutIndex = findLayoutByName(layouts, ev.target.value as string)
        if (~layoutIndex) setSelectedLayout(layouts[layoutIndex])
    }

    const classes = useStyles();


    useEffect(() => {
        fetcher('http://127.0.0.1:3000/layout/all', setLayouts)
        
    }, [])

    useEffect(() => {
        if (layouts[0]) {
            console.log(layouts[0].name)
        }
    }, [layouts])

    return(
        <div>
            <FormControl className = {classes.testClass}>
            <div>{}</div>
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
                        el => <TextField label = {el} key = {el} className = {classes.textField} variant='filled'/>
                    )}
                </div>
                <div id="test">
                    {layoutStringParser(selectedLayout.layout)}
                </div>
            </FormControl>
        </div>
    )
}