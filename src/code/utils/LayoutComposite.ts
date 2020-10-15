export declare type TOperator = '&&' | '||' | 'none';

export abstract class Layout {
    protected parent: Layout | null = null;

    get getParent() {
        return this.parent;
    }
    public setParent(parent: Layout | null) {
        this.parent = parent;
    }

    public add(component: Layout): void { };
    public remove(component: Layout): void { };

    abstract get getValue(): string;

}


export class LeafString extends Layout {
    private basicString: string = '';

    set value(value: string) {
        this.basicString = value;
    }

    get getValue() {
        return this.basicString;
    }
}

export class LeafVariable extends Layout {
    private name: string;
    private operator: string;

    /**
     * 
     * 
     * @param name - variable name for its definition in layout and layout string
     */
    constructor(name: string, operator: TOperator) {
        super();
        this.name = name;
        this.operator = operator;
    }

    get getValue() {
        switch (this.operator) {
            case 'none': 
                return '${' + this.name + '}'
            default:
                return '${' + this.name + `} ${this.operator}`
        }
    }
}

export class LayoutComposite extends Layout {
    protected children: Layout[] = [];

    public add(component: Layout) {
        this.children.push(component);
        component.setParent(this);
    }

    public remove(component: Layout) {
        const compIndex: number = this.children.indexOf(component);
        this.children.splice(compIndex, 1);

        component.setParent(null)
    }

    public get getValue() {
        let result: string = '';
        for (let child of this.children) {
            result+=child.getValue;
        }
        return result
    }
}