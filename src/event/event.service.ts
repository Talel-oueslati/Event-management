import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity'; // Make sure the path is correct
import { Event } from './entities/event.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {

    const event = this.eventRepository.create(createEventDto);

     await this.eventRepository.save(event);
     await this.notificationService.createNotification(
      'added',
      `New event "${event.name}" added.`,
    );

    return event;
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
      
    await  this.eventRepository.save(event);
    await this.notificationService.createNotification(
      'updated',
      `Event "${event.name}"  updated.`,
    );

    return event;
  
  }

 remove(id: number) {
  const event = this.eventRepository.findOne({ where: { id } });
  this.notificationService.createNotification(
    'deleted',
    `Event "${event}"  deleted.`,
  );
    this.eventRepository.delete(id);


  }
  async findAllByName(name: string): Promise<Event[]> {
    const events = await this.eventRepository.find({ where: { name } });
    if (events.length === 0) {
      throw new NotFoundException(`No events found with name "${name}"`);
    }
    return events;
  }
  async findByDate(date: Date): Promise<Event[]> {
    const events = await this.eventRepository.find({ where: { date } });
    if (events.length === 0) {
      throw new NotFoundException(`Event with name "${date}" not found`);
    }
    return events;
  }

  async findByCategorie(categorie: string): Promise<Event[]> {
    const events = await this.eventRepository.find({ where: { categorie } });
    if (events.length === 0) {
      throw new NotFoundException(`Event with name "${categorie}" not found`);
    }
    return events;
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
