import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    role: null, // 'Candidate', 'Recruiter', or 'Admin'
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.role = action.payload.role;
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.role = null;
        }
    }
});

export const { setCredentials, logoutUser } = authSlice.actions;
export default authSlice.reducer;