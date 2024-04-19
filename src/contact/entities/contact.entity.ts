import { BooleanTransformer } from '../../typeorm/transformers/boolean.transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('varchar', { length: 255 })
  firstName: string;

  @Column('varchar', { length: 255, default: () => '' })
  lastName: string;

  @Column('varchar', { length: 255 })
  phoneNumber: string;

  @Column('varchar', { nullable: true, length: 255 })
  address?: string;

  @Column('boolean', {
    transformer: new BooleanTransformer(),
    default: () => 'false',
  })
  isFavorite: boolean;

  @Column('boolean', {
    transformer: new BooleanTransformer(),
    default: () => 'false',
  })
  isBlocked: boolean;

  @Column('varchar', { nullable: true, length: 255 })
  imageUrl?: string;

  @Column('varchar', { nullable: true, length: 255 })
  email?: string;

  @Column('text', { nullable: true })
  notes?: string;
}
