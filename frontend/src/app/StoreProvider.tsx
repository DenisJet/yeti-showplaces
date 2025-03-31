'use client';
import {useRef} from 'react';
import {Provider} from 'react-redux';
import {AppStore, makeStore} from '../store/store';
import {fetchShowplaces} from '@/store/showplaces.slice';

export default function StoreProvider({children}: {children: React.ReactNode}) {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
        storeRef.current.dispatch(fetchShowplaces());
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}
