import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity'; // Make sure the path is correct
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {

    const event = this.eventRepository.create(createEventDto);

    return await this.eventRepository.save(event);
  }


  findAll() {
    return this.eventRepository.find();
  }


  async findOne(id: number): Promise<Event> {
    return this.eventRepository.findOneOrFail({ where: { id } }); 
}

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
  
  
    event.name = updateEventDto.name;
    event.date = updateEventDto.date;
      
    return  this.eventRepository.save(event);
  }

 remove(id: number) {
     this.eventRepository.delete(id);
  }

  async addUserToEvent(eventId: number, userId: number): Promise<Event> {

    const event = await this.eventRepository.findOne({
        where: { id: eventId }, 
        relations: ['users'],
    });

    const user = await this.userRepository.findOne({
        where: { id: userId }, 
    });

    if (!event || !user) {
        throw new Error('Event or User not found');
    }

    if (!event.users.some(existingUser => existingUser.id === user.id)) {
        event.users.push(user);
    }

    return this.eventRepository.save(event);
}
async removeUserFromEvent(eventId: number, userId: number): Promise<Event> {
  const event = await this.eventRepository.findOne({
    where: { id: eventId },
    relations: ['users'],
  });

  if (!event) {
    throw new NotFoundException('Event not found');
  }

  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  
  event.users = event.users.filter(existingUser => existingUser.id !== userId);

 
  return this.eventRepository.save(event);
}


async getEventParticipants(eventId: number): Promise<{ eventId: number; participants: { userId: number; username: string }[] }> {
  const event = await this.eventRepository.findOne({
    where: { id: eventId },
    relations: ['users'],
  });

  if (!event) {
    throw new Error('Event not found');
  }

  const participants = event.users.map(user => ({
    userId: user.id,
    username: user.username,
  }));

  return {
    eventId: event.id,
    participants: participants,
  };
}


}
