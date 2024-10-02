import { configureStore } from "@reduxjs/toolkit";

import todoReducer from '../slice/todo'

const rootReducer = {
    todo: todoReducer,
    // posts: postsReducer
}

const store = configureStore({
    reducer: rootReducer
})

// const store = configureStore({
//     reducer: todoReducer
// })

export default store