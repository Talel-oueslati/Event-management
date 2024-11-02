import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "src/event/entities/event.entity";
import { Role } from "src/role.enum";
@Entity()
export class User {
@PrimaryGeneratedColumn()
id: number;

@Column()
    firstName:string;

@Column()
    lastName:string;
@Column()
    password:string;
@Column()
   username:string;    

   @ManyToMany(() => Event, (event) => event.users)
   events: Event[]; // Make sure this is defined for the inverse side of the relationship
 
@Column({
    type: 'enum',
    enum: Role,
    default: Role.USER, 
})
role: Role; 


}
