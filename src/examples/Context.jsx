import React, { useState, useEffect, useContext, createContext } from 'react';
import {Button,Container} from '@mui/material'; 
const Context = createContext();

export default function ContextExample(){
    const [state,setState] = useState({
        name: 'John Doe',
        value:30
    });

    const onClick = (evt) => {
        console.log('clicked');
        evt.preventDefault();
        setState({
            ...state,
            value: state.value + 1,
            name: 'BOB'
        })

    }
    console.log('PARENT STATE', state);
    const value = {state,setState,onClick};
    console.log("🚀 ~ file: Context.jsx:22 ~ ContextExample ~ value:", value)
    return(
        <Context.Provider value={value}>
        <Container>
            <h3>Parent Values</h3>
            {state.value} ? {state.value} : 'Null'
            {state.name} ? {state.name} : 'Null'
            <h3>Grand Parent</h3>
            <GrandParent/>
        </Container>
        </Context.Provider>
    );   
}

export function GrandParent(){
    const {state,setState} = useContext(Context);
    console.log('Grand Parent State Values', state);
    const {name,value} = state;

    return(
        <div>
            <div>
                <h3>Grand Parent Values</h3>
                
                Name :{name} ? {name} : 'Null'
                Value :{value} ? {value} : 'Null'
                <h3>Parent Component</h3>
                <Parent/>
                
            </div>
        </div>
    )
}

export function Parent(){
    const {state,setState,onClick} = useContext(Context);
    const {name,value} = state;
    console.log('Parent State Values', state);
    return(
        <div>
            <h3>Parent Values</h3>
            Name :{name} ? {name} : 'Null'
            Value :{value} ? {value} : 'Null'
            <Button onClick={onClick}>Click Me</Button>
        </div>
    )
}