import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        addUser: (state, action) => {
            state.user.push(action.payload);
        },
        updateUser: (state, action) => {
            const index = state.user.findIndex(
                (user) => user.id === action.payload.id
            );
            if (index !== -1) {
                state.user[index] = action.payload;
            }
        },
        deleteUser: (state, action) => {
            state.user = state.user.filter((user) => user.id !== action.payload);
        },
    },
});

export const { setUser, addUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
