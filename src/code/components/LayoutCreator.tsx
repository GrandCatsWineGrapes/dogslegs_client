import {LayoutComposite, LeafString, LeafVariable, TOperator, Layout} from '../utils/LayoutComposite'
import React, {useState, useEffect, ReactElement} from 'react';
import { TextField } from '@material-ui/core';

// const splitString = (string: string, tree: LayoutComposite): LayoutComposite => {
//     const borders: [string, string] = ['~[', ']'];
//     const operators: TOperator[] = ['&&', '||', 'none'];
//     const varStartIndex: number = string.lastIndexOf(borders[0])
//     const varFinishIndex: number = string.lastIndexOf(borders[1])
//     if (!~varStartIndex) {
//         let newBranch = new LeafString();
//         newBranch.value=string;
//         newBranch.setParent(tree);
//         return tree;
//     } else {
//         if (varFinishIndex) {
//             const newBranch = new LayoutComposite();
//             newBranch.setParent(tree); 
            
//             return splitString(string.slice(varStartIndex+2, varFinishIndex), )
//         } else return string;

//         // const strings: string[] = string.split(/~\[[a-z]{1}[0-9a-z]{1,}?\]/gi);
//         // const vars = string.match(/~\[[a-z]{1}[0-9a-z]{1,}?\]/gi)
//         // return [strings, vars]


//     }
    
// } //to dev

export function LayoutCompositeComponent() {
    const [inputLayout, setInputLayout] = useState<String>('')
    const [inputTree, setInputTree] = useState<LayoutComposite>(new LayoutComposite())

    const test = () => {
        let tree = new LayoutComposite();

        let branch1 = new LayoutComposite();
        let branch2 = new LayoutComposite();
        let branch3 = new LayoutComposite();

        let leaf1 = new LeafString();
        let leaf2 = new LeafString();
        let leaf3 = new LeafString();
        let leaf4 = new LeafString();

        let variab1 = new LeafVariable('Glock', '&&');

        branch3.add(variab1)

        tree.add(branch1);
        tree.add(branch2);

        branch2.add(branch3);
        
        branch3.add(leaf3);
        branch3.add(leaf1);
        branch2.add(leaf2);
        branch2.add(leaf1);
    
        leaf1.value = ' Да.'
        leaf2.value = ' Лист 2.'
        leaf3.value = ' Нет.'
        leaf4.value = ' Пробирка.'

        console.log(branch3.getValue);
        return (tree.getValue);
    }

    useEffect(() => {
        setInputLayout(test())
    }, [])

    const handleInputLayout = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        // console.log(splitString(ev.target.value as string))
        setInputLayout(ev.target.value as string)
    }

    return (
        <React.Fragment>
            <div>{inputLayout}</div>
            
            <TextField
                multiline
                rows="5"
                variant="outlined"
                value={inputLayout}
                style={{minWidth: 500}}
                onChange={handleInputLayout}
            >
                <span className="TEST">Stop</span>
            </TextField>
        </React.Fragment>
    )
}