import { ILayout } from "../components/BoilerPlateForm";

export function layoutStringParser(layoutString: string) {
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
    
    toSliceStrings.forEach(el => layoutString = layoutString.replace(el, `|||${el.slice(2, el.length-1)}|||`))
    layoutString = layoutString.replace('`', '')
    
    return layoutString

}