'use client';

import './Search.scss';
import {TextInput} from '@gravity-ui/uikit';
import {useAppDispatch, useAppSelector} from '@/store/store.hooks';
import {setSearchQuery} from '@/store/showplaces.slice';
import block from 'bem-cn-lite';

const b = block('search');

export const Search = () => {
    const {searchQuery} = useAppSelector((state) => state.showplaces);
    const dispatch = useAppDispatch();

    const handleSearch = (value: string) => {
        dispatch(setSearchQuery(value));
    };

    return (
        <TextInput
            hasClear
            placeholder="Search place by name or location "
            value={searchQuery}
            onUpdate={handleSearch}
            size="m"
            className={b()}
        />
    );
};
