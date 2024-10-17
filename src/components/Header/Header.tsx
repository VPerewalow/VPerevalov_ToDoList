import { useEffect, useState } from 'react';
import './Header.css';

function Header({ inputText, setInputText, addTodo, deleteAllTodo, deleteLastTodo, searchTodo }:
    {
        inputText: string,
        setInputText: (value: string) => void,
        addTodo: () => void,
        deleteAllTodo: () => void,
        deleteLastTodo: () => void,
        searchTodo: (query: string) => void
    }) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        searchTodo(e.target.value);
    };
    return (
        <div className='header'>
            <button className='header__button' onClick={deleteAllTodo}>Delete All</button>
            <button className='header__button' onClick={deleteLastTodo}>Delete Last</button>
            <input placeholder='Add todo'
                className='header__input'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}>
            </input>
            <button className='header__button' onClick={addTodo}>Add</button>
            </div>
    );
}

export default Header;