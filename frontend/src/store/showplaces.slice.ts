/* eslint-disable no-param-reassign */
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

export interface Showplace {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    rating: number;
    imageUrl: string;
    location: string;
    latitude: number;
    longitude: number;
    mapLink: string;
    status: 'planned' | 'visited';
}

interface ShowplacesState {
    places: Showplace[];
    activePlaceId: number | null;
    activePlace: Showplace | null;
    isLoading: boolean;
    error: string | null;
    adminMode: boolean;
    hideVisited: boolean;
    modalOpen: boolean;
    searchQuery: string;
}

const initialState: ShowplacesState = {
    places: [],
    activePlaceId: null,
    activePlace: null,
    isLoading: false,
    error: null,
    adminMode: false,
    hideVisited: false,
    modalOpen: false,
    searchQuery: '',
};

export const fetchAllShowplaces = createAsyncThunk('showplaces/fetchAllShowplaces', async () => {
    const response = await axios.get('http://localhost:3001/showplaces');
    return response.data;
});

export const fetchShowplace = createAsyncThunk('showplaces/fetchShowplace', async (id: number) => {
    const response = await axios.get(`http://localhost:3001/showplaces/${id}`);
    return response.data;
});

export const addShowplace = createAsyncThunk(
    'showplaces/addShowplace',
    async (showplace: Omit<Showplace, 'id'>) => {
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
            state.adminMode = !state.adminMode;
        },
        toggleHideVisited(state) {
            state.hideVisited = !state.hideVisited;
        },
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
        setActivePlaceId(state, action) {
            state.activePlaceId = action.payload;
        },
        toggleModalOpen(state) {
            state.modalOpen = !state.modalOpen;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAllShowplaces.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllShowplaces.fulfilled, (state, action) => {
                state.isLoading = false;
                state.places = action.payload;
            })
            .addCase(fetchAllShowplaces.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to load places';
            })
            .addCase(fetchShowplace.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchShowplace.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activePlace = action.payload;
            })
            .addCase(fetchShowplace.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to load place';
            })
            .addCase(addShowplace.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addShowplace.fulfilled, (state, action) => {
                state.isLoading = false;
                state.places.push(action.payload);
            })
            .addCase(addShowplace.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create place';
            })
            .addCase(updateShowplace.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateShowplace.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.places.findIndex((place) => place.id === action.payload.id);
                if (index !== -1) {
                    state.places[index] = action.payload;
                }
            })
            .addCase(updateShowplace.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update place';
            })
            .addCase(deleteShowplace.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteShowplace.fulfilled, (state, action) => {
                state.isLoading = false;
                state.places = state.places.filter((place) => place.id !== action.payload);
            })
            .addCase(deleteShowplace.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete place';
            });
    },
});

export const {
    toggleAdminMode,
    toggleHideVisited,
    toggleModalOpen,
    setSearchQuery,
    setActivePlaceId,
} = showplacesSlice.actions;

export default showplacesSlice.reducer;
