import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  isFavorite?: boolean;

  @Column()
  isBlocked: boolean;

  @Column({ nullable: true })
  imageUrl?: string;
}
