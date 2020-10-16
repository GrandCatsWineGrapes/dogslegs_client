import {LayoutComposite, LeafString, LeafVariable, TOperator, Layout} from '../utils/LayoutComposite'
import React, {useState, useEffect, ReactElement} from 'react';
import { TextField } from '@material-ui/core';

import {BranchNode, LeafStrNode, LeafVarBuilder} from '../utils/Stringy'

export function LayoutCompositeComponent() {
    const root = BranchNode.createRoot();

    root.push()
        .leafVar('Test', 'InputText')


    root.push()
            .branch([
                new LeafStrNode(),
                new LeafVarBuilder()
                    .build(),
                new LeafVarBuilder()
                    .setName('Test from builder')
                    .setOperator('&&')
                    .setType('SwitchBool')
                    .build(),
            ]).push()
                .branch([
                    new LeafVarBuilder()
                        .setName('Test from child branch')
                        .setType('InputText')
                        .build(),
                    new LeafStrNode()
                ])


    const rootPipe = BranchNode.createRoot();
    
    rootPipe
        .push()
            .branch()
                .push()
                    .branch()

    console.log(root.getObject())


    return (
        <div>{JSON.stringify(root.getObject())}</div>
    )
}


// export function LayoutCompositeComponent() {
//     const [inputLayout, setInputLayout] = useState<String>('')
//     const [inputTree, setInputTree] = useState<LayoutComposite>(new LayoutComposite())

//     const test = () => {
//         let tree = new LayoutComposite();

//         let branch1 = new LayoutComposite();
//         let branch2 = new LayoutComposite();
//         let branch3 = new LayoutComposite();

//         let leaf1 = new LeafString();
//         let leaf2 = new LeafString();
//         let leaf3 = new LeafString();
//         let leaf4 = new LeafString();

//         let variab1 = new LeafVariable('Glock', '&&');

//         branch3.add(variab1)

//         tree.add(branch1);
//         tree.add(branch2);

//         branch2.add(branch3);
        
//         branch3.add(leaf3);
//         branch3.add(leaf1);
//         branch2.add(leaf2);
//         branch2.add(leaf1);
    
//         leaf1.value = ' Да.'
//         leaf2.value = ' Лист 2.'
//         leaf3.value = ' Нет.'
//         leaf4.value = ' Пробирка.'

//         console.log(branch3.getValue);
//         return (tree.getValue);
//     }

//     useEffect(() => {
//         setInputLayout(test())
//     }, [])

//     const handleInputLayout = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
//         // console.log(splitString(ev.target.value as string))
//         setInputLayout(ev.target.value as string)
//     }

//     return (
//         <React.Fragment>
//             <div>{inputLayout}</div>
            
//             <TextField
//                 multiline
//                 rows="5"
//                 variant="outlined"
//                 value={inputLayout}
//                 style={{minWidth: 500}}
//                 onChange={handleInputLayout}
//             >
//                 <span className="TEST">Stop</span>
//             </TextField>
//         </React.Fragment>
//     )
// }