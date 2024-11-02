import { Body, Injectable, NotFoundException, Param, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}
 async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await  this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneByOrFail({ id });

  }
  async findOneWithUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOneByOrFail({ username });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
  
  
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
  
    return this.userRepository.save(user);
  }
  remove(id: number) {
     this.userRepository.delete(id);
  }

//--------------------------------------------------------------
}
