import { LeafString } from "./LayoutComposite";

declare type TOperator = '&&' | '||' | null;

declare type TStringyVariable= 'InputText' | 'InputDate' | 'InputTime' | 'SwitchBool' | 'MultiSelect';

interface IBranchNode {
    add(child: Stringy): void;
    push(): any;
    
}

interface IPush {
    leafVar(name: string, type: TStringyVariable, operator?: TOperator): IPush,
    leafStr(basicString: string): IPush,
    branch(): {
        in: IPush,
        $: IPush
    },
    out(): IPush
}

abstract class Stringy {
    abstract baseType: string;
    protected _parent: IBranchNode | null;
    constructor (parent: IBranchNode | null = null) {
        this._parent = parent;
        if (this._parent) this._parent.add(this)

    }

    public resetParent(parent: IBranchNode | null = null) {
        this._parent = parent;
    }

    abstract getObject(): {}[] | {};

    abstract getString(): string;

}

class BranchNode extends Stringy {
    private _children: Stringy[] = [];
    readonly baseType = 'BranchNode' 
    public add(child: Stringy) {
        this._children.push(child);
    }
    
    get parent() {
        return this._parent;
    }

    public getObject() {
        const type: string = this._parent ? 'branch' : 'root';
        const children = this._children.map(child => child.getObject())
        return {
            type,
            children
        }
    }

    public getString() {
        return this._children.map(child => child.getString()).join('')
    }

    public getChild(index: number) {
        const len = this._children.length;
        if (index>len || index<0) throw new Error(`Error in BranchNode.getChild() - this element has no child with index ${index}`)
        return this._children[index];
    }

    public getLastChild() {
        return this.getChild(this._children.length-1)
    }


    /**
     * Forming new branch 
     * @param children If there are any, you can push children directly in the root.
     * @returns BranchNode with parent; if there are no parent, then works like formRoot().
     */
    static createBranch(parent: BranchNode | null = null) {
        return new BranchNode(parent);
    }
    /**
     * Forming root node with 'null' as parent.
     * @returns BranchNode with no parent
     */
    static createRoot() {
        return new BranchNode(null)
    }
    /**
     * Forming leafNode. 
     * @returns an object with two methods: leafStr and leafVar
     */
    public push(): IPush {
        return {
            leafStr: (basicString: string): IPush => {
                const leaf = new LeafStrNode(this);
                leaf.basicString = basicString;
                return this.push();
            },
            leafVar: (name: string, type: TStringyVariable, operator: TOperator | null = null) => {

                const leafBuilder = new LeafVarBuilder(this)
                                        .setName(name)
                                        .setType(type)
                                        .setOperator(operator)
                if (type === 'SwitchBool') leafBuilder.setOperator(null)
                const leaf = leafBuilder.build();
                return this.push();
            },
            branch: (children?: Stringy[]) => {
                const branch = new BranchNode(this);
                if (children) 
                    children.forEach(child => {
                        child.resetParent(branch)
                        branch.add(child)
                    })
                return {
                    in: branch.push(),
                    $: this.push()
                };
            },
            out: () => {
                if (this.parent) return this.parent.push()
                else {
                    return this
                }
            },


        }
    }
}

// class BranchBuilder {
//     private _branch: BranchNode;
//     constructor(parent: IBranchNode | null = null) {
//         this._branch = new BranchNode(parent)
//     }

//     leafStr(basicString:) {}
// }

class LeafVarBuilder {
    private _leaf: LeafVarNode;
    /**
     * 
     * @param parent Parent branch. If nothing defined, then 'null'.
     */
    constructor(parent: BranchNode | null = null) {
        this._leaf = new LeafVarNode(parent);
    }

    /**
     * 
     * @param name Variable name.
     */
    public setName(name: string) {
        this._leaf.name = name;
        return this;
    }

    /**
     * 
     * @param type Variable type.
     */
    public setType(type: TStringyVariable): LeafVarBuilder {
        this._leaf.type = type;
        return this;
    }

    /**
     * 
     * @param operator Operator used with variable.
     * @type TOpeartor
     */
    public setOperator(operator: TOperator): LeafVarBuilder {
        this._leaf.operator = operator;
        return this;
    }
    /**
     * @returns LeafVarNode
     */
    public build() {
        return this._leaf;
    }
    
}

class LeafStrNode extends Stringy{
    readonly baseType = 'LeafStrNode';
    private _basicString: string = '';

    set basicString(string: string) {
        this._basicString = string;
    }

    public getString() {
        return this._basicString;
    }

    public getObject() {
        return {
            type: 'LeafStr',
            basicString: this._basicString
        }
    }

}

class LeafVarNode extends Stringy {
    private _name: string = '';
    private _type: TStringyVariable = 'InputText';
    private _operator: TOperator = null;
    readonly baseType = 'LeafVarNode';
    

    public getString() {
        if (this._operator) {
            return '${' + this._name + '}' + this._operator
        } else return '${' + this._name + '}'
    }

    set name(name: string) {
        this._name = name;
    }

    set type(type: TStringyVariable) {
        this._type = type;
    }

    set operator(operator: TOperator) {
        this._operator = operator;
    }

    public getObject() {
        return {
            type: 'LeafVar',
            name: this._name,
            varType: this._type,
            operator: this._operator
        }
    }
}



export {BranchNode, LeafStrNode, LeafVarBuilder};