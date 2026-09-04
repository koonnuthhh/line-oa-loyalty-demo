import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Branch } from './branch.entity';
import { Admin } from './admin.entity';
import { Sale } from './sale.entity';

@Entity('wifihotspot_lineoa')
export class Lineoa {
  @PrimaryGeneratedColumn()
  lineoa_id: number;

  @Column()
  lineoa_uid: string;

  @Column()
  lineoa_name: string;

  @Column({ default: true })
  lineoa_isactive: boolean;

  @Column({ nullable: true })
  lineoa_remark: string;

  @OneToMany(() => Branch, branch => branch.lineoa)
  branches: Branch[];

  @OneToMany(() => Admin, admin => admin.lineoa)
  admins: Admin[];

  @OneToMany(() => Sale, sale => sale.lineoa)
  sales: Sale[];
}
