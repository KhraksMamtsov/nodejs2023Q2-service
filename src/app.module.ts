import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ConfigModule } from '@nestjs/config';
import { ApplicationLoggerModule } from './logger/application-logger.module';
import { ApplicationLoggerMiddleware } from './logger/application-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApplicationLoggerModule,
    UserModule,
    TrackModule,
    AlbumModule,
    ArtistModule,
    FavoritesModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApplicationLoggerMiddleware).forRoutes('*');
  }
}
