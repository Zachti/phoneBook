import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('contacts')
export class Contacts {
  @PrimaryColumn()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;
}
