import type {Metadata} from 'next';
import {DEFAULT_BODY_CLASSNAME} from '../components/Wrapper';
import {App} from '../components/App';

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import '../styles/globals.scss';
import StoreProvider from './StoreProvider';

export const metadata: Metadata = {
    title: 'Yeti Showplaces',
    description: 'Next.js, Redux-Toolkit, Gravity UI, Nest.js App Example',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body className={DEFAULT_BODY_CLASSNAME}>
                <StoreProvider>
                    <App>{children}</App>
                </StoreProvider>
            </body>
        </html>
    );
}
