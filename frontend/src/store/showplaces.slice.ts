import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

interface Showplace {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    rating: number;
    imageUrl: string;
    location: string;
    latitude: number;
    longitude: number;
    status: 'planned' | 'visited';
}

interface ShowplacesState {
    places: Showplace[];
    isLoading: boolean;
    error: string | null;
    adminMode: boolean;
    hideVisited: boolean;
    searchQuery: string;
}

const initialState: ShowplacesState = {
    places: [],
    isLoading: false,
    error: null,
    adminMode: false,
    hideVisited: false,
    searchQuery: '',
};

export const fetchShowplaces = createAsyncThunk('showplaces/fetchShowplaces', async () => {
    const response = await axios.get('http://localhost:3001/showplaces');
    return response.data;
});

export const addShowplace = createAsyncThunk(
    'showplaces/addShowplace',
    async (showplace: Omit<Showplace, 'id' | 'createdAt'>) => {
        const response = await axios.post('http://localhost:3001/showplaces', showplace);
        return response.data;
    },
);

export const updateShowplace = createAsyncThunk(
    'showplaces/updateShowplace',
    async (showplace: Showplace) => {
        const response = await axios.put(
            `http://localhost:3001/showplaces/${showplace.id}`,
            showplace,
        );
        return response.data;
    },
);

export const deleteShowplace = createAsyncThunk(
    'showplaces/deleteShowplace',
    async (id: number) => {
        await axios.delete(`http://localhost:3001/showplaces/${id}`);
        return id;
    },
);

const showplacesSlice = createSlice({
    name: 'showplaces',
    initialState,
    reducers: {
        toggleAdminMode(state) {
            // state.adminMode = !state.adminMode;
            return {...state, adminMode: !state.adminMode};
        },
        toggleHideVisited(state) {
            state.hideVisited = !state.hideVisited;
        },
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchShowplaces.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchShowplaces.fulfilled, (state, action) => {
                state.isLoading = false;
                state.places = action.payload;
            })
            .addCase(fetchShowplaces.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to load data';
            })
            .addCase(addShowplace.fulfilled, (state, action) => {
                state.places.push(action.payload);
            })
            .addCase(updateShowplace.fulfilled, (state, action) => {
                const index = state.places.findIndex((place) => place.id === action.payload.id);
                if (index !== -1) {
                    state.places[index] = action.payload;
                }
            })
            .addCase(deleteShowplace.fulfilled, (state, action) => {
                state.places = state.places.filter((place) => place.id !== action.payload);
            });
    },
});

export const {toggleAdminMode, toggleHideVisited, setSearchQuery} = showplacesSlice.actions;

export default showplacesSlice.reducer;
