import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Showplace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'int' })
  rating: number;

  @Column()
  imageUrl: string;

  @Column()
  location: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column()
  mapLink: string;

  @Column({ default: 'planned' })
  status: 'planned' | 'visited';
}
