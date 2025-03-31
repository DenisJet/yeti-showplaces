'use client';

import {useAppSelector} from '@/store/store.hooks';
import {FC, useEffect, useState} from 'react';
import {Table, withTableActions, withTableSorting} from '@gravity-ui/uikit';
import type {TableDataItem} from '@gravity-ui/uikit';
import {PencilToSquare, TrashBin} from '@gravity-ui/icons';

const TableWithSorting = withTableSorting<TableDataItem>(Table);
const TableWithSortingAndActions = withTableActions<TableDataItem>(TableWithSorting);

interface PlacesListProps {}

export const PlacesList: FC<PlacesListProps> = () => {
    const [isClient, setIsClient] = useState(false);

    const {places, isLoading, error, adminMode} = useAppSelector((state) => state.showplaces);

    console.log(places);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const columns = [
        {id: 'name', name: 'Name', meta: {sort: true}},
        {id: 'location', name: 'Location', meta: {sort: true}},
        {id: 'rating', name: 'Rating', meta: {sort: true}},
        {id: 'status', name: 'Status'},
    ];

    const getRowActions = () => {
        return [
            {
                text: 'Edit',
                icon: <TrashBin />,
                handler: () => {},
            },
            {
                text: 'Remove',
                icon: <PencilToSquare />,
                handler: () => {},
                theme: 'danger' as const,
            },
        ];
    };

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
