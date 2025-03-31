'use client';

import {FC, ReactNode, useState} from 'react';
import block from 'bem-cn-lite';
import {Button, Icon, Modal, Switch, Theme, ThemeProvider} from '@gravity-ui/uikit';
import {Moon, Sun} from '@gravity-ui/icons';

import './Wrapper.scss';
import {useAppDispatch, useAppSelector} from '@/store/store.hooks';
import {setActivePlaceId, toggleAdminMode, toggleModalOpen} from '@/store/showplaces.slice';
import {PlaceForm} from '../PlaceForm';

const b = block('wrapper');

const DARK = 'dark';
const LIGHT = 'light';
const DEFAULT_THEME = DARK;

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`;

interface WrapperProps {
    children: ReactNode;
}

export const Wrapper: FC<WrapperProps> = ({children}) => {
    const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
    const dispatch = useAppDispatch();

    const {adminMode, modalOpen, activePlaceId} = useAppSelector((state) => state.showplaces);

    const handleModeChange = () => {
        dispatch(toggleAdminMode());
    };

    const handleModalClose = () => {
        dispatch(toggleModalOpen());
        dispatch(setActivePlaceId(null));
    };

    const isDark = theme === DARK;

    return (
        <ThemeProvider theme={theme}>
            <div className={b()}>
                <div className={b('controls')}>
                    <Button view="action" size="m" onClick={handleModalClose}>
                        Add new place
                    </Button>
                    <div>
                        <Switch size="m" checked={adminMode} onChange={handleModeChange}>
                            Admin mode
                        </Switch>
                        <Button
                            size="l"
                            view="outlined"
                            onClick={() => {
                                setTheme(isDark ? LIGHT : DARK);
                            }}
                            className={b('theme-button')}
                        >
                            <Icon data={isDark ? Sun : Moon} />
                        </Button>
                    </div>
                </div>
                <div className={b('layout')}>
                    <div className={b('content')}>{children}</div>
                </div>
            </div>
            <Modal open={modalOpen} onClose={handleModalClose}>
                <PlaceForm placeId={activePlaceId ?? undefined} onCancel={handleModalClose} />
            </Modal>
        </ThemeProvider>
    );
};
