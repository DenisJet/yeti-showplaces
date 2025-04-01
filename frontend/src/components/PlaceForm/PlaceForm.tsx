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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (activePlace && activePlace.id === placeId) {
            setFormData(activePlace);
        }
    }, [activePlace, placeId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (placeId) {
            dispatch(
                updateShowplace({
                    ...formData,
                    mapLink: `https://maps.google.com/?q=${formData.latitude}, ${formData.longitude}`,
                } as Showplace),
            );
            onCancel();
        } else {
            dispatch(
                addShowplace({
                    ...formData,
                    status: 'planned',
                    createdAt: new Date().toISOString(),
                    mapLink: `https://maps.google.com/?q=${formData.latitude}, ${formData.longitude}`,
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
                errorPlacement="inside"
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
                errorPlacement="inside"
            />
            <TextInput
                label="Широта"
                value={formData.latitude.toString()}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
            />
            <TextInput
                label="Долгота"
                value={formData.longitude.toString()}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
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
