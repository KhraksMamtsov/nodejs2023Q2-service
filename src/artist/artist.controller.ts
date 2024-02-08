import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Artist } from './entities/artist.entity';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Access token is missing or invalid',
})
@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @ApiOperation({
    summary: 'Gets all artists',
    description: 'Gets all artists',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    isArray: true,
    type: Artist,
  })
  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @ApiOperation({
    summary: 'Add new artist',
    description: 'Add new artist',
  })
  @ApiCreatedResponse({
    description: 'Successful operation',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Body does not contain required fields',
  })
  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @ApiOperation({
    summary: 'Get single artist by id',
    description: 'Get single artist by id',
  })
  @ApiParam({ name: 'artistId', format: 'uuid' })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Artist id is invalid (not uuid)',
  })
  @Get(':artistId')
  async findOne(@Param('artistId', ParseUUIDPipe) id: string) {
    const maybeArtist = await this.artistService.findOne(id);
    if (maybeArtist === null) {
      throw new NotFoundException(`There is no artist with id ${id}`);
    } else {
      return maybeArtist;
    }
  }

  @ApiOperation({
    summary: 'Update artist information',
    description: 'Update library artist information by UUID',
  })
  @ApiParam({ name: 'artistId', format: 'uuid' })
  @ApiOkResponse({
    description: 'The artist has been updated',
    type: Artist,
  })
  @ApiBadRequestResponse({
    description: 'Artist id is invalid (not uuid)',
  })
  @Put(':artistId')
  async update(
    @Param('artistId', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const maybeArtist = await this.artistService.update(id, updateArtistDto);

    if (maybeArtist === null) {
      throw new NotFoundException(`There is no artist with id ${id}`);
    } else {
      return maybeArtist;
    }
  }

  @ApiOperation({
    summary: 'Delete artist',
    description: 'Delete artist from library',
  })
  @ApiParam({ name: 'artistId', format: 'uuid' })
  @ApiNoContentResponse({
    description: 'Deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Artist id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist was not found',
  })
  @Delete(':artistId')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('artistId', ParseUUIDPipe) id: string) {
    const maybeArtist = await this.artistService.remove(id);

    if (maybeArtist === null) {
      throw new NotFoundException(`There is no artist with id ${id}`);
    }
  }
}
