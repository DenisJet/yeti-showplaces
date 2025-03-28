import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ShowplacesService } from './showplaces.service';
import { Showplace } from './showplace.entity';
import { CreateShowplaceDto, UpdateShowplaceDto } from './showplace.dto';

@Controller('showplaces')
export class ShowplacesController {
  constructor(private readonly showplacesService: ShowplacesService) {}

  @Get()
  findAll(): Promise<Showplace[]> {
    return this.showplacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Showplace | null> {
    return this.showplacesService.findOne(+id);
  }

  @Post()
  create(@Body() createShowplaceDto: CreateShowplaceDto): Promise<Showplace> {
    return this.showplacesService.create(createShowplaceDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowplaceDto: UpdateShowplaceDto,
  ): Promise<Showplace | null> {
    return this.showplacesService.update(+id, updateShowplaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.showplacesService.remove(+id);
  }
}
