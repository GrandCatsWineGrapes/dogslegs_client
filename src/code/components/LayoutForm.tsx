import React, {useState, useEffect} from 'react';
import {FormControl, Select, InputLabel, MenuItem, makeStyles} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    testClass: {
        minWidth: 120,
        margin: theme.spacing(2) 
    }
}))

export default function LayoutForm() {
    const [test, setTest] = useState('')
    const [layouts, setLayouts] = useState([])
    
    const handleChange = (ev: React.ChangeEvent<{ value: unknown }>) => {
        setTest(ev.target.value as string)
    }
    function fetcher(url: string, setter: Function) {
        fetch(url)
            .then(res => res.json())
            .then(formattedData => setter(formattedData))
    }

    const classes = useStyles();


    useEffect(() => {
        fetcher('http://127.0.0.1:3000/layout/all', setLayouts)
    }, [])

    return(
        <div>
            <FormControl className = {classes.testClass}>
                <InputLabel id = "selectHandler">Test</InputLabel>
                <Select 
                    labelId="selectHandler"
                    value={test}
                    onChange={handleChange}
                >
                    {layouts.map(el =><MenuItem value={el.name}>{el}</MenuItem>)}
                    {/* <MenuItem value = {}>Stop</MenuItem> */}
                </Select>
            </FormControl>
        </div>
    )
}