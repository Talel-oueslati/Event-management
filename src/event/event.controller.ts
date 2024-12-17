import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('addevent')
  //@Roles(Role.Admin) 
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(createEventDto);
  }

  @Get('allevents')
  findAll(){
    return this.eventService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
  @Post(':eventId/participants/:userId')
  async addUserToEvent(
      @Param('eventId') eventId: number,
      @Param('userId') userId: number
  ): Promise<Event> {
      return this.eventService.addUserToEvent(eventId, userId);
  }
  
 


  @Get(':eventId/participants')

  async getParticipants(@Param('eventId') eventId: number): Promise<{ eventId: number; participants: { userId: number; username: string }[] }> {
    return this.eventService.getEventParticipants(eventId);
  }

  @Get('name/:name')
  async getEventsByName(@Param('name') name: string): Promise<Event[]> {
    return this.eventService.findAllByName(name);
  }
  @Get('date/:date')
  async getEventByDate(@Param('date') date: Date): Promise<Event[]> {
    return this.eventService.findByDate(date);
  }
  @Get('categorie/:categorie')
  async getEventByCategorie(@Param('categorie') categorie: string): Promise<Event[]> {
    return this.eventService.findByCategorie(categorie);
  }
}
