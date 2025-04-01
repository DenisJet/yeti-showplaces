'use client';

import {useAppDispatch, useAppSelector} from '@/store/store.hooks';
import {FC, useCallback, useEffect, useState} from 'react';
import {Table, withTableActions, withTableSorting} from '@gravity-ui/uikit';
import {PencilToSquare, TrashBin} from '@gravity-ui/icons';
import {
    Showplace,
    deleteShowplace,
    setActivePlaceId,
    toggleModalOpen,
} from '@/store/showplaces.slice';

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

    const {places, isLoading, error, adminMode} = useAppSelector((state) => state.showplaces);

    console.log(places);

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

    if (!isClient) {
        return <div className="g-table g-table_with-sticky-scroll" />;
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <div>Places count: {places.length}</div>
            <TableWithSortingAndActions
                data={places}
                columns={columns}
                stickyHorizontalScroll={true}
                getRowActions={adminMode ? getRowActions : undefined}
            />
        </>
    );
};
