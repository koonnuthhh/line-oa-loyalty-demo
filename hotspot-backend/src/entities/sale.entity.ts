import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Lineoa } from './lineoa.entity';

@Entity('aurora_sale')
export class Sale {
  @PrimaryGeneratedColumn()
  sale_id;

  @Column({ type: 'varchar', length: 255 })
  sale_uid;

  @Column({ type: 'varchar', length: 255 })
  sale_displayname;

  @Column()
  lineoa_id;

  @ManyToOne(() => Lineoa, lineoa => lineoa.sales)
  @JoinColumn({ name: 'lineoa_id' })
  lineoa;
}
