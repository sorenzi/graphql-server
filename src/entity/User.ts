import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole, UserRoles, UserRoleType } from '../modules/user/constants';
@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('varchar', { length: 255, nullable: true }) first_name: string;

  @Column('varchar', { length: 255, nullable: true }) last_name: string;

  @Column('varchar', { length: 255, unique: true }) email: string;

  @Column('text') password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRole.USER
  })
  role: UserRoleType;
}
