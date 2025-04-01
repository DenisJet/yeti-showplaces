'use client';

import {useAppDispatch, useAppSelector} from '@/store/store.hooks';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Checkbox, Table, withTableActions, withTableSorting} from '@gravity-ui/uikit';
import {PencilToSquare, TrashBin} from '@gravity-ui/icons';
import {
    Showplace,
    deleteShowplace,
    setActivePlaceId,
    toggleHideVisited,
    toggleModalOpen,
} from '@/store/showplaces.slice';
import {Search} from '../Search';
import './PlacesList.scss';
import block from 'bem-cn-lite';

const b = block('placesList');

const TableWithSorting = withTableSorting<Showplace>(Table);
const TableWithSortingAndActions = withTableActions<Showplace>(TableWithSorting);

const columns = [
    {id: 'name', name: 'Name', meta: {sort: true}},
    {id: 'location', name: 'Location', meta: {sort: true}},
    {id: 'rating', name: 'Rating', meta: {sort: true}},
    {id: 'status', name: 'Status', meta: {sort: true}},
];

export const PlacesList: FC = () => {
    const [isClient, setIsClient] = useState(false);

    const {places, isLoading, error, adminMode, searchQuery, hideVisited} = useAppSelector(
        (state) => state.showplaces,
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const getRowActions = useCallback(() => {
        return [
            {
                text: 'Edit',
                icon: <PencilToSquare />,
                handler: (item: Showplace) => {
                    dispatch(setActivePlaceId(item.id));
                    dispatch(toggleModalOpen());
                },
            },
            {
                text: 'Remove',
                icon: <TrashBin />,
                handler: (item: Showplace) => {
                    dispatch(deleteShowplace(item.id));
                },
                theme: 'danger' as const,
            },
        ];
    }, []);

    const filteredPlaces = useMemo(() => {
        let result = [...places];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (place) =>
                    place.name.toLowerCase().startsWith(query) ||
                    place.location.toLowerCase().startsWith(query),
            );
        }

        if (hideVisited) {
            result = result.filter((place) => place.status !== 'visited');
        }

        return result;
    }, [places, searchQuery, hideVisited]);

    if (!isClient) {
        return <div className="g-table g-table_with-sticky-scroll" />;
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <div className={b('controls')}>
                <span>Places count: {filteredPlaces.length}</span>
                <Search />
                <Checkbox
                    size="m"
                    checked={hideVisited}
                    onChange={() => dispatch(toggleHideVisited())}
                >
                    <span>Hide visited</span>
                </Checkbox>
            </div>
            <TableWithSortingAndActions
                data={filteredPlaces}
                columns={columns}
                stickyHorizontalScroll={true}
                getRowActions={adminMode ? getRowActions : undefined}
                width="max"
            />
        </>
    );
};
