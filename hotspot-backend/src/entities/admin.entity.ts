import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Lineoa } from './lineoa.entity';

//swagger
@Entity('wifihotspot_admin')
export class Admin {
  @PrimaryGeneratedColumn()
  admin_id: number;

  @Column()
  admin_uid: string;

  @Column()
  lineoa_uid: string;

  @ManyToOne(() => Lineoa, lineoa => lineoa.admins)
  @JoinColumn({ name: 'lineoa_uid' }) 
  lineoa: Lineoa;
}
