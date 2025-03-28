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
