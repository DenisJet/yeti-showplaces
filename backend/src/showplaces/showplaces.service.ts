import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showplace } from './showplace.entity';
import { CreateShowplaceDto, UpdateShowplaceDto } from './showplace.dto';

@Injectable()
export class ShowplacesService {
  constructor(
    @InjectRepository(Showplace)
    private showplacesRepository: Repository<Showplace>,
  ) {}

  async onModuleInit() {
    await this.createInitialShowplaces();
  }

  private async createInitialShowplaces() {
    const count = await this.showplacesRepository.count();
    if (count === 0) {
      const initialShowplaces: CreateShowplaceDto[] = [
        {
          name: 'Эйфелева башня',
          description: 'Знаменитая металлическая башня в Париже',
          rating: 5,
          imageUrl: 'https://example.com/eiffel.jpg',
          location: 'Париж, Франция',
          latitude: 48.8584,
          longitude: 2.2945,
          status: 'planned',
        },
        {
          name: 'Колизей',
          description: 'Амфитеатр в Риме, памятник древнеримской архитектуры',
          rating: 5,
          imageUrl: 'https://example.com/colosseum.jpg',
          location: 'Рим, Италия',
          latitude: 41.8902,
          longitude: 12.4924,
          status: 'planned',
        },
        {
          name: 'Статуя Свободы',
          description: 'Колоссальная скульптура в Нью-Йорке',
          rating: 4,
          imageUrl: 'https://example.com/statue-of-liberty.jpg',
          location: 'Нью-Йорк, США',
          latitude: 40.6892,
          longitude: -74.0445,
          status: 'visited',
        },
        {
          name: 'Великая Китайская стена',
          description: 'Крупнейший памятник архитектуры',
          rating: 5,
          imageUrl: 'https://example.com/great-wall.jpg',
          location: 'Китай',
          latitude: 40.4319,
          longitude: 116.5704,
          status: 'planned',
        },
        {
          name: 'Мачу-Пикчу',
          description:
            'Город древней Америки, находящийся на вершине горного хребта',
          rating: 5,
          imageUrl: 'https://example.com/machu-picchu.jpg',
          location: 'Перу',
          latitude: -13.1631,
          longitude: -72.545,
          status: 'planned',
        },
        {
          name: 'Тадж-Махал',
          description: 'Мавзолей-мечеть в Агре, Индия',
          rating: 5,
          imageUrl: 'https://example.com/taj-mahal.jpg',
          location: 'Агра, Индия',
          latitude: 27.1751,
          longitude: 78.0421,
          status: 'planned',
        },
        {
          name: 'Пирамиды Гизы',
          description: 'Комплекс древних памятников на плато Гиза',
          rating: 5,
          imageUrl: 'https://example.com/pyramids.jpg',
          location: 'Гиза, Египет',
          latitude: 29.9792,
          longitude: 31.1342,
          status: 'planned',
        },
        {
          name: 'Сидуней мост',
          description: 'Стеклянный мост в Китае',
          rating: 4,
          imageUrl: 'https://example.com/glass-bridge.jpg',
          location: 'Хунань, Китай',
          latitude: 29.3916,
          longitude: 110.6341,
          status: 'planned',
        },
        {
          name: 'Собор Василия Блаженного',
          description: 'Православный храм на Красной площади',
          rating: 5,
          imageUrl: 'https://example.com/basil-cathedral.jpg',
          location: 'Москва, Россия',
          latitude: 55.7525,
          longitude: 37.6231,
          status: 'visited',
        },
        {
          name: 'Опера Хаус',
          description: 'Современное здание оперного театра в Сиднее',
          rating: 4,
          imageUrl: 'https://example.com/opera-house.jpg',
          location: 'Сидней, Австралия',
          latitude: -33.8568,
          longitude: 151.2153,
          status: 'planned',
        },
      ];

      for (const showplace of initialShowplaces) {
        await this.create(showplace);
      }
    }
  }

  findAll(): Promise<Showplace[]> {
    return this.showplacesRepository.find();
  }

  async findOne(id: number): Promise<Showplace> {
    const showplace = await this.showplacesRepository.findOne({
      where: { id },
    });
    if (!showplace) {
      throw new NotFoundException(`Showplace not found`);
    }
    return showplace;
  }

  create(createShowplaceDto: CreateShowplaceDto): Promise<Showplace> {
    const showplace = this.showplacesRepository.create(createShowplaceDto);
    return this.showplacesRepository.save(showplace);
  }

  async update(
    id: number,
    updateShowplaceDto: UpdateShowplaceDto,
  ): Promise<Showplace> {
    const showplace = await this.findOne(id);

    const updated = this.showplacesRepository.merge(
      showplace,
      updateShowplaceDto,
    );
    return this.showplacesRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.showplacesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Showplace not found`);
    }
  }
}
