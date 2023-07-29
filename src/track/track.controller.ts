import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Track } from './entities/track.entity';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiOperation({
    summary: 'Get tracks list',
    description: 'Gets all library tracks list',
  })
  @ApiOkResponse({
    description: 'Successful operation',
    isArray: true,
    type: Track,
  })
  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @ApiOperation({
    summary: 'Add new track',
    description: 'Add new track information',
  })
  @ApiCreatedResponse({
    description: 'Successful operation',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Body does not contain required fields',
  })
  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @ApiOperation({
    summary: 'Get single track by id',
    description: 'Get single track by id',
  })
  @ApiParam({ name: 'trackId', format: 'uuid' })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Track id is invalid (not uuid)',
  })
  @Get(':trackId')
  async findOne(@Param('trackId', ParseUUIDPipe) id: string) {
    const maybeTrack = await this.trackService.findOne(id);
    if (maybeTrack === null) {
      throw new NotFoundException(`There is no track with id ${id}`);
    } else {
      return maybeTrack;
    }
  }

  @ApiOperation({
    summary: 'Update track information',
    description: 'Update library track information by UUID',
  })
  @ApiParam({ name: 'trackId', format: 'uuid' })
  @ApiOkResponse({
    description: 'The track has been updated',
    type: Track,
  })
  @ApiBadRequestResponse({
    description: 'Track id is invalid (not uuid)',
  })
  @Put(':trackId')
  async update(
    @Param('trackId', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const maybeTrack = await this.trackService.update(id, updateTrackDto);

    if (maybeTrack === null) {
      throw new NotFoundException(`There is no track with id ${id}`);
    } else {
      return maybeTrack;
    }
  }

  @ApiOperation({
    summary: 'Delete track',
    description: 'Delete track from library',
  })
  @ApiParam({ name: 'trackId', format: 'uuid' })
  @ApiNoContentResponse({
    description: 'Deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Track id is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Track was not found',
  })
  @Delete(':trackId')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('trackId', ParseUUIDPipe) id: string) {
    const maybeTrack = await this.trackService.remove(id);

    if (maybeTrack === null) {
      throw new NotFoundException(`There is no track with id ${id}`);
    }
  }
}
