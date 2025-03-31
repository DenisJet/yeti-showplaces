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

    const [formData, setFormData] = useState<Omit<Showplace, 'id' | 'createdAt' | 'status'>>({
        name: '',
        description: '',
        imageUrl: '',
        location: '',
        latitude: 0,
        longitude: 0,
        rating: 0,
    });

    useEffect(() => {
        setFormData({
            name: '',
            description: '',
            imageUrl: '',
            location: '',
            latitude: 0,
            longitude: 0,
            rating: 0,
        });

        if (placeId) {
            dispatch(fetchShowplace(placeId));
        }
    }, [placeId, dispatch]);

    useEffect(() => {
        if (activePlace && activePlace.id === placeId) {
            setFormData(activePlace);
        }
    }, [activePlace, placeId]);

    console.log('activePlace', activePlace);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (placeId) {
            dispatch(updateShowplace(formData as Showplace));
            onCancel();
            console.log(formData);
        } else {
            dispatch(
                addShowplace({...formData, status: 'planned', createdAt: new Date().toISOString()}),
            );
            onCancel();
            console.log({...formData, createdAt: new Date().toISOString()});
        }
    };

    return (
        <form onSubmit={handleSubmit} className={b()}>
            <h2>Создание достопримечательности</h2>
            <TextInput
                label="Название"
                placeholder="Название"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <TextArea
                placeholder="Описание"
                minRows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <TextInput
                placeholder="Фото URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
            <TextInput
                placeholder="Местоположение"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <TextInput
                label="Широта"
                value={formData.latitude.toString()}
                onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
            />
            <TextInput
                label="Долгота"
                value={formData.longitude.toString()}
                onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
            />
            <Select
                label="Рейтинг"
                value={[formData.rating.toString()]}
                onUpdate={(val) => setFormData({...formData, rating: parseInt(val[0])})}
                options={[1, 2, 3, 4, 5].map((num) => ({
                    value: num.toString(),
                    content: num.toString(),
                }))}
            />
            <div className={b('buttons')}>
                <Button type="submit">Создать</Button>
                <Button onClick={onCancel}>Отмена</Button>
            </div>
        </form>
    );
};
