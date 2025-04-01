### Запуск backend

cd backend => npm i => npm run start:dev

### Запуск frontend

cd frontend => npm i => npm run dev

### Документация REST API

Базовый URL - http://localhost:3000

1. Получить список достопримечательностей

- Метод: GET
- URL: /showplaces
- пример ответа
  \```
  [
  {
  "id": 1,
  "name": "Эйфелева башня",
  "description": "Знаменитая металлическая башня в Париже",
  "createdAt": "2023-05-15T10:00:00Z",
  "rating": 5,
  "photoUrl": "https://example.com/eiffel.jpg",
  "location": "Париж, Франция",
  "latitude": 48.8584,
  "longitude": 2.2945,
  "mapLink": "https://maps.google.com/?q=48.8584, 2.2945",
  "status": "planned"
  },
  ...
  ]
  \```

2. Получить одну достопримечательность по id

- Метод: GET
- URL: /showplaces/:id
- пример ответа
  \```
  {
  "id": 1,
  "name": "Эйфелева башня",
  "description": "Знаменитая металлическая башня в Париже",
  "createdAt": "2023-05-15T10:00:00Z",
  "rating": 5,
  "photoUrl": "https://example.com/eiffel.jpg",
  "location": "Париж, Франция",
  "latitude": 48.8584,
  "longitude": 2.2945,
  "mapLink": "https://maps.google.com/?q=48.8584, 2.2945",
  "status": "planned"
  }
  \```

3. Создать достопримечательность

- Метод: POST
- URL: /showplaces
- Тело запроса:
  \```
  {
  "name": "Название",
  "description": "Описание",
  "rating": 3,
  "photoUrl": "URL фото",
  "location": "Местоположение",
  "latitude": "0.0",
  "longitude": "0.0",
  "mapLink": "URL map"
  }
  \```

4.  Обновить достопримечательность

- Метод: PUT
- URL: /showplaces
- Тело запроса (только обновляемые поля):
  \```
  {
  "name": "Обновленное название",

  "rating": 4,
  "status": "visited"
  }
  \```

5. Удалить достопримечательность

- Метод: DELETE
- URL: /showplaces/:id
