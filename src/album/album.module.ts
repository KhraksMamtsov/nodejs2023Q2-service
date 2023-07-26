import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { DatabaseModule } from '../database/database.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [DatabaseModule, TrackModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
