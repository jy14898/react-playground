import React, { Component } from 'react';
import './App.css';
import {
    Input,
} from 'reactstrap';

import peg from 'pegjs';

const parser = peg.generate(`
{
    function tag(v, t) {
        return { v: v, tag: t };
    }

    function op(v) { return tag(v,"op") }
    function bracket(v) { return tag(v,"bracket") }
    function int_(v) { return tag(v,"int") }
}

Expr
  = Term (v:("+"/"-") {return op(v)}) Term 
  / Term

Term 
  = Factor (v:"*" {return op(v)}) Factor
  / Factor

Factor 
  = (v:"(" {return bracket(v)}) Expr (v:")" {return bracket(v)})
  / Integer

Integer
  = v:[0-9]+ {return int_(v)}
`);

function mapResult (value) {
    if ("map" in value)
        return <span>{value.map((v,i) => <span key={i}>{mapResult(v)}</span>)}</span>;
    else {
        const color = {
            "op": "red",
            "bracket": "green",
            "int": "blue"
        }[value.tag];
        return <span style={{color}}>{value.v}</span>;
    }
}
class App extends Component {
    constructor (props) {
        super(props);
        
        this.state = {
            value: "1*(2+3)",
        };
    }


    handleChange ({target:{value}}) {
        this.setState({ value });
    }

    render () {
        var result = "";
        try {
            result = mapResult(parser.parse(this.state.value));
        } catch (e) { 
            result = e.message;
        }

        return (
            <div>
                <Input type="text" value={this.state.value} onChange={this.handleChange.bind(this)}/>
                {result}
            </div>
        );
    }
}

export default App;
