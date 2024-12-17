// notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;  // Type of notification (added, updated, etc.)

  @Column()
  message: string;  // The content of the notification

  @Column()
  timestamp: Date;  // The timestamp when the notification was created
}
