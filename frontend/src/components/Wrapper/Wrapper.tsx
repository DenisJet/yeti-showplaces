'use client';

import {FC, ReactNode, useState} from 'react';
import block from 'bem-cn-lite';
import {Button, Icon, Switch, Theme, ThemeProvider} from '@gravity-ui/uikit';
import {Moon, Sun} from '@gravity-ui/icons';

import './Wrapper.scss';
import {useAppDispatch, useAppSelector} from '@/store/store.hooks';
import {toggleAdminMode} from '@/store/showplaces.slice';

const b = block('wrapper');

const DARK = 'dark';
const LIGHT = 'light';
const DEFAULT_THEME = DARK;

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`;

export type AppProps = {
    children: ReactNode;
};

export const Wrapper: FC<AppProps> = ({children}) => {
    const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
    const dispatch = useAppDispatch();

    const {adminMode} = useAppSelector((state) => state.showplaces);

    const handleModeChange = () => {
        dispatch(toggleAdminMode());
    };

    const isDark = theme === DARK;

    return (
        <ThemeProvider theme={theme}>
            <div className={b()}>
                <div className={b('theme-button')}>
                    <Switch size="m" checked={adminMode} onChange={handleModeChange}>
                        Admin mode
                    </Switch>
                    <Button
                        size="l"
                        view="outlined"
                        onClick={() => {
                            setTheme(isDark ? LIGHT : DARK);
                        }}
                    >
                        <Icon data={isDark ? Sun : Moon} />
                    </Button>
                </div>
                <div className={b('layout')}>
                    {/* <div className={b('header')}>
                        <div className={b('logo')}>
                            <div className={b('gravity-logo', {dark: isDark})} />
                            <div className={b('next-logo', {dark: isDark})} />
                        </div>
                    </div> */}
                    <div className={b('content')}>{children}</div>
                </div>
            </div>
        </ThemeProvider>
    );
};
