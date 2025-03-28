import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showplace } from './showplace.entity';
import { ShowplacesService } from './showplaces.service';
import { ShowplacesController } from './showplaces.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Showplace])],
  providers: [ShowplacesService],
  controllers: [ShowplacesController],
})
export class ShowplacesModule {}
