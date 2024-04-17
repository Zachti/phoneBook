import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;
}
