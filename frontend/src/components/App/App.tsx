'use client';

import {FC, ReactNode, useState} from 'react';

import {Ghost} from '@gravity-ui/icons';
import {AsideHeader} from '@gravity-ui/navigation';

import {Wrapper} from '../Wrapper';

interface AppProps {
    children: ReactNode;
}

export const App: FC<AppProps> = ({children}) => {
    const [isMenuClose, setIsMenuClose] = useState(true);

    return (
        <AsideHeader
            logo={{icon: Ghost, text: 'Yeti Showplaces'}}
            compact={isMenuClose}
            onChangeCompact={() => setIsMenuClose(!isMenuClose)}
            renderContent={() => <Wrapper>{children}</Wrapper>}
            menuItems={[]}
        />
    );
};
