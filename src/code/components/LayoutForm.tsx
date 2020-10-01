import React, {useState} from 'react';
import {FormControl, Select, InputLabel, MenuItem, makeStyles} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    testClass: {
        minWidth: 120,
        margin: theme.spacing(2) 
    }
}))

export default function LayoutForm() {
    const [test, setTest] = useState('')
    
    const handleChange = (ev: React.ChangeEvent<{ value: unknown }>) => {
        setTest(ev.target.value as string)
    }

    const classes = useStyles();

    return(
        <div>
            <FormControl className = {classes.testClass}>
                <InputLabel id = "selectHandler">Test</InputLabel>
                <Select 
                    labelId="selectHandler"
                    value={test}
                    onChange={handleChange}
                >
                    <MenuItem value = "Stop">Stop</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}