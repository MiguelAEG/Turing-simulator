export class TuringMachine {
    rules: Rule[];
    id: string;
    acceptState: State;

    input: string;
    position: number = 0;
    state: State = "q0";

    constructor(rules: Rule[], acceptState: State, input: string, id: string) {
        this.rules = rules;
        this.acceptState = acceptState;
        this.input = input;
        this.id = id;
    }

    step(): [Direction, State, string, number] {
        let currentChar = this.input[this.position];
        let rule = this.rules.find(rule => rule.currentChar === currentChar && rule.currentState === this.state);
        if (rule) {
            this.input = this.input.slice(0, this.position) + rule.newChar + this.input.slice(this.position + 1);
            this.state = rule.newState;
            this.position += rule.move === 'R' ? 1 : rule.move === 'L' ? -1 : 0;
            return [rule.move, rule.newState, this.input, this.rules.indexOf(rule)];
        }
        return ['S', this.state, this.input, -1];
    }

    accept(): boolean {
        return this.state === this.acceptState;
    }

    newString(input: string) {
        this.input = input;
        this.position = 0;
        this.state = "q0";
    }
}

export type Rule = {
    currentState: State;
    currentChar: string;
    newState: State;
    newChar: string;
    move: Direction;
};

export type Direction = "L" | "R" | "S";

export type State = `q${number}`;
