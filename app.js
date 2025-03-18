const { createAsyncThunk, createSlice, configureStore } = require('@reduxjs/toolkit');
const axios = require('axios')

// 1. API
const API = "https://jsonplaceholder.typicode.com/posts";

// 2. Initial State
const initialState = {
    posts: [],      // fulfilled
    loading: false, // pending
    error: null,    //rejected
}

// 3. Create Async Thiunk
const fetchPosts = createAsyncThunk('posts/fetchPosts', async ()=>{
    const res = await axios.get(API);
    return res.data; // Grabbing the data only instead of the whole response
});

// 4. Slice
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    // extraReducers - handles promise based actions
    extraReducers: (builder) => {
        // Handle lifecycle - pending, fulfilled, rejected
        // pending
        builder.addCase(fetchPosts.pending, (state, action) => {
            state.loading = true;
        });

        // fulfilled
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
        });    

        // rejected
        builder.addCase(fetchPosts.rejected, (state, action) => {
            state.posts = [];
            state.loading = false;
            state.error = action.payload;
        });    
    }
});

// 5. Generate Reducer
const postsReducer = postsSlice.reducer;

// 6. Store
const store = configureStore({
    reducer: postsReducer,
})

// 7. Dispatch
store.subscribe(()=>{
    console.log(store.getState())
})
store.dispatch(fetchPosts())