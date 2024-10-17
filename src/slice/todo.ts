import { createAsyncThunk, createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { ITodo } from "../interfaces";

export const fetchTodos = createAsyncThunk(
    "todo/fetchTodos",
    async function(_, {rejectWithValue}) {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos");
            if (!response.ok) {
                throw new Error("Что-то пошло не так")
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
)

export const deleteTodos = createAsyncThunk(
    "todo/deleteTodos",
    async function(id: number, {rejectWithValue, dispatch}) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {method: "DELETE"});
            if (!response.ok) {
                throw new Error("Ошибка при удалении")
            }
            dispatch(removeTodoRedux(id))
        }
        catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
)

const todoSlice = createSlice({
    name: "todo",
    initialState: {
        todo: [],
        status: null,
        error: null,
        totalTodos: 0,
        completedTodos: 0,
        searchQuery: ""
    },
    reducers: {
        addTodoRedux(state: any, {payload}: {payload: any}) {
            state.todo.push(payload);
            state.totalTodos += 1;
        },
        removeTodoRedux(state: any, {payload}: {payload: any}) {
            const index = state.todo.findIndex((item: ITodo) => item.id === payload)
            if (index !== -1) {
                if (state.todo[index].isChecked) {
                    state.completedTodos -= 1;
                }
                state.todo.splice(index, 1);
                state.totalTodos -= 1;
            }
        },
        changeTodoRedux(state: any, {payload}: {payload: any}) {
            const current = state.todo.find((item: ITodo) => item.id === payload);
            if (current) {
                current.isChecked = !current.isChecked;
                state.completedTodos = state.todo.filter((todo: ITodo) => todo.isChecked).length;
            }
        },
        deleteAllTodoRedux(state: any) {
            state.todo.length = 0;
            state.totalTodos = 0;
            state.completedTodos = 0;
        },
        deleteLastTodoRedux(state: any) {
            const lastTodo = state.todo.pop();
            if (lastTodo) {
                state.totalTodos -= 1;
                if (lastTodo.isChecked) {
                    state.completedTodos -= 1;
                }
            }
        },
        searchTodoRedux(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        }
    },
    extraReducers: (builder) => {
        return builder.addCase(fetchTodos.pending, (state: any) => {
            state.status = "loading";
            state.error = null;

        }),
        builder.addCase(fetchTodos.fulfilled, (state: any, {payload}: {payload: any}) => {
            state.status = "resolved";
            state.error = null;
            state.todo = payload;
            state.totalTodos = payload.length;
            state.completedTodos = payload.filter((todo: ITodo) => todo.isChecked).length;
        }),
        builder.addCase(fetchTodos.rejected, (state: any, {payload}: {payload: any}) => {
            state.status = "rejected";
            state.error = payload;
            state.todo = [];
            state.totalTodos = 0;
            state.completedTodos = 0;
        }),
        builder.addCase(deleteTodos.rejected, (state: any, {payload}: {payload: any}) => {
            state.status = "rejected";
            state.error = payload;
        })
    }
})


const {actions, reducer} = todoSlice;

export default reducer;
export const {addTodoRedux, removeTodoRedux, changeTodoRedux, deleteAllTodoRedux, deleteLastTodoRedux, searchTodoRedux} = actions;