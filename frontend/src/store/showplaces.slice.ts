/* eslint-disable no-param-reassign */
import {toaster} from '@gravity-ui/uikit/toaster-singleton';
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
                state.error = null;
                state.places = action.payload;
            })
            .addCase(fetchAllShowplaces.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to load places';
                toaster.add({
                    title: 'Не загрузить данные',
                    name: 'Не загрузить данные',
                    theme: 'danger',
                });
            })
            .addCase(fetchShowplace.fulfilled, (state, action) => {
                state.activePlace = action.payload;
            })
            .addCase(fetchShowplace.rejected, () => {
                toaster.add({
                    title: 'Не удалось загрузить данные',
                    name: 'Не удалось загрузить данные',
                    theme: 'danger',
                });
            })
            .addCase(addShowplace.fulfilled, (state, action) => {
                state.places.push(action.payload);
                toaster.add({
                    title: 'Успешно создано',
                    name: 'Успешно создано',
                    theme: 'success',
                });
            })
            .addCase(addShowplace.rejected, () => {
                toaster.add({
                    title: 'Не удалось создать',
                    name: 'Не удалось создать',
                    theme: 'danger',
                });
            })
            .addCase(updateShowplace.fulfilled, (state, action) => {
                const index = state.places.findIndex((place) => place.id === action.payload.id);
                if (index !== -1) {
                    state.places[index] = action.payload;
                }
                toaster.add({
                    title: 'Успешно обновлено',
                    name: 'Успешно обновлено',
                    theme: 'success',
                });
            })
            .addCase(updateShowplace.rejected, () => {
                toaster.add({
                    title: 'Не удалось обновить',
                    name: 'Не удалось обновить',
                    theme: 'danger',
                });
            })
            .addCase(deleteShowplace.fulfilled, (state, action) => {
                state.places = state.places.filter((place) => place.id !== action.payload);
                toaster.add({
                    title: 'Успешно удалено',
                    name: 'Успешно удалено',
                    theme: 'success',
                });
            })
            .addCase(deleteShowplace.rejected, () => {
                toaster.add({
                    title: 'Не удалось удалить',
                    name: 'Не удалось удалить',
                    theme: 'danger',
                });
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
