import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Card from './components/Card/Card';
import Header from './components/Header/Header';
import { useState } from 'react';
import { addTodoRedux, removeTodoRedux, changeTodoRedux, deleteAllTodoRedux, fetchTodos, deleteTodos, deleteLastTodoRedux, searchTodoRedux } from './slice/todo';

interface ITodo {
  id: number,
  title: string,
  date: string,
  isChecked: boolean
}

function App() {

  const [inputText, setInputText] = useState("");

  const dispatch = useDispatch()<any>;
  const todos = useSelector((state: any) => state.todo)

  function addTodo() {
    if (inputText !== "") {
      let formatDate = String(new Date()).slice(4, 10);
      let todoObject = {
        id: Date.now(),
        title: inputText,
        date: formatDate,
        isChecked: false
      }
      // состояние не должно изменяться напрямую
      dispatch(addTodoRedux(todoObject))
    }
    setInputText("");
  }

  function remove(id: number) {
    dispatch(deleteTodos(id))
  }

  function changeTodo(id: number) {
    dispatch(changeTodoRedux(id))
  }

  function deleteLastTodo() {
    dispatch(deleteLastTodoRedux());
  }

  function filterTodos(query: string) {
    dispatch(searchTodoRedux(query));
  }

  const filteredTodos = todos.todo.filter((todo: ITodo) =>
    todo.title && todo.title.toLowerCase().includes(todos.searchQuery.toLowerCase()));
    
    

  return (
    <>
      <div className='container'>
      <Header 
            inputText={inputText} 
            setInputText={setInputText} 
            addTodo={addTodo}
            deleteAllTodo={() => dispatch(deleteAllTodoRedux())} 
            deleteLastTodo={deleteLastTodo}
            searchTodo={filterTodos} 
        />
        <div className='counters'>
          <p>Total: {todos.totalTodos}</p>
          <p>Completed: {todos.completedTodos}</p>
          <input 
          type="text" 
          placeholder="Search todos..." 
          className='header__input' onChange={(e) => filterTodos(e.target.value)} />
        </div>
        {todos.status === "loading" && <h2>Loading...</h2>}
        {todos.error && <h2>ERROR!!!!</h2>}
        {filteredTodos.length > 0 ? (
          <div className='card-container'>
            {filteredTodos.map((item: ITodo, index: number) => <Card key={index} oneTodo={item} remove={remove} changeTodo={changeTodo}></Card>)}
          </div>
        ) : null}
      </div>
    </>

  );
}

export default App;
