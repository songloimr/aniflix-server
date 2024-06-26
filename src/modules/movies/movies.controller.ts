import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QuerySearchVideoDto } from '../videos/dto/search-video.dto';
import { ParseMongoIdPipe } from 'src/pipes/mongoid-validation.pipe';
import { Types } from 'mongoose';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get('search')
  search(@Req() req, @Query() query : QuerySearchVideoDto) {
    return this.moviesService.search(query);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }
  @Get("schedules")
  findSchedules() {
    return this.moviesService.findSchedules();
  }

  @Get("now")
  findNow() {
    return this.moviesService.findNow();
  }


  @Get("top")
  findTop(@Query() query : QuerySearchVideoDto) {
    return this.moviesService.findTop(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
