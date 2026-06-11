import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('credentials')
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ unique: true })
  credentialId!: string;

  @Column('text')
  publicKey!: string;

  @Column({ default: 0 })
  counter!: number;

  @Column('simple-array', { nullable: true })
  transports!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
