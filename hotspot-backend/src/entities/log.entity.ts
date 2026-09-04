import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Branch } from './branch.entity';

@Entity('wifihotspot_log')
export class Log {
  @PrimaryGeneratedColumn()
  log_id: number;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  wifi_username: string;

  @Column()
  lineoa_name: string;

  @Column()
  user_name: string;

  @Column()
  branch_name: string;

  @Column()
  lineoa_uid: string;

  @Column()
  user_uid: string;

  @Column()
  branch_code: string;

  @ManyToOne(() => Branch, branch => branch.logs)
  @JoinColumn({name: "branch_code"})
  branch: Branch;
}
