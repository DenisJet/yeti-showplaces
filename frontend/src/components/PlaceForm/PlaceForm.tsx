import {Showplace, addShowplace, fetchShowplace, updateShowplace} from '@/store/showplaces.slice';
import {useAppDispatch, useAppSelector} from '@/store/store.hooks';
import {Button, Select, TextArea, TextInput} from '@gravity-ui/uikit';
import {FC, useEffect, useState} from 'react';
import './PlaceForm.scss';
import block from 'bem-cn-lite';

interface PlaceFormProps {
    onCancel: () => void;
    placeId?: number;
}

const b = block('form');

const COORDINATE_REGEX = /^-?\d{1,3}(\.\d+)?$/;

export const PlaceForm: FC<PlaceFormProps> = ({onCancel, placeId}) => {
    const {activePlace} = useAppSelector((state) => state.showplaces);
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<Omit<Showplace, 'id' | 'createdAt'>>({
        name: '',
        description: '',
        imageUrl: '',
        location: '',
        latitude: '',
        longitude: '',
        rating: 0,
        mapLink: '',
        status: 'planned',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setFormData({
            name: '',
            description: '',
            imageUrl: '',
            location: '',
            latitude: '',
            longitude: '',
            rating: 0,
            mapLink: '',
            status: 'planned',
        });

        if (placeId) {
            dispatch(fetchShowplace(placeId));
        }
    }, [placeId, dispatch]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Название обязательно';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Местоположение обязательно';
        }

        if (!formData.latitude.trim()) {
            newErrors.latitude = 'Широта обязательна';
        } else if (!COORDINATE_REGEX.test(formData.latitude)) {
            newErrors.latitude = 'Неверный формат широты (пример: 48.8584)';
        }

        if (!formData.longitude.trim()) {
            newErrors.longitude = 'Долгота обязательна';
        } else if (!COORDINATE_REGEX.test(formData.longitude)) {
            newErrors.longitude = 'Неверный формат долготы (пример: 2.2945)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (activePlace && activePlace.id === placeId) {
            setFormData(activePlace);
        }
    }, [activePlace, placeId]);

    const handleCoordinateChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: 'latitude' | 'longitude',
    ) => {
        const value = e.target.value;
        if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
            setFormData({...formData, [field]: value});
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const payload = {
            ...formData,
            latitude: parseFloat(formData.latitude).toFixed(6),
            longitude: parseFloat(formData.longitude).toFixed(6),
            mapLink: `https://maps.google.com/?q=${formData.latitude},${formData.longitude}`,
        };

        if (placeId) {
            dispatch(updateShowplace(payload as Showplace));
            onCancel();
        } else {
            dispatch(
                addShowplace({
                    ...payload,
                    status: 'planned',
                    createdAt: new Date().toISOString(),
                }),
            );
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className={b()}>
            <h2>{placeId ? 'Редактирование' : 'Создание'}</h2>
            <TextInput
                label="Название"
                placeholder="Название"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                errorMessage={errors.name}
                validationState={errors.name ? 'invalid' : undefined}
            />
            <TextArea
                placeholder="Описание"
                minRows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <TextInput
                label="Фото URL"
                placeholder="Фото URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
            <TextInput
                label="Местоположение"
                placeholder="Местоположение"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                errorMessage={errors.location}
                validationState={errors.location ? 'invalid' : undefined}
            />
            <TextInput
                label="Широта"
                placeholder="0.0"
                value={formData.latitude}
                onChange={(e) => handleCoordinateChange(e, 'latitude')}
                errorMessage={errors.latitude}
                validationState={errors.latitude ? 'invalid' : undefined}
            />
            <TextInput
                label="Долгота"
                placeholder="0.0"
                value={formData.longitude}
                onChange={(e) => handleCoordinateChange(e, 'longitude')}
                errorMessage={errors.longitude}
                validationState={errors.longitude ? 'invalid' : undefined}
            />
            {placeId && (
                <TextInput
                    label="Ссылка"
                    value={formData.mapLink}
                    onChange={(e) => setFormData({...formData, mapLink: e.target.value})}
                />
            )}
            <Select
                label="Рейтинг"
                value={[formData.rating.toString()]}
                onUpdate={(val) => setFormData({...formData, rating: parseInt(val[0])})}
                options={[1, 2, 3, 4, 5].map((num) => ({
                    value: num.toString(),
                    content: num.toString(),
                }))}
            />
            {placeId && (
                <Select
                    label="Статус"
                    value={[formData.status]}
                    onUpdate={(val) =>
                        setFormData({...formData, status: val[0] as 'planned' | 'visited'})
                    }
                    options={[
                        {value: 'planned', content: 'В планах'},
                        {value: 'visited', content: 'Осмотрена'},
                    ]}
                />
            )}
            <div className={b('buttons')}>
                <Button type="submit">Сохранить</Button>
                <Button onClick={onCancel}>Отмена</Button>
            </div>
        </form>
    );
};
