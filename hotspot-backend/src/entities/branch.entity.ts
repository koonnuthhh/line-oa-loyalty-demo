import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Lineoa } from './lineoa.entity';
import { Log } from './log.entity';
import { WifiUsage } from './wifi-usage.entity';

@Entity('wifihotspot_branch')
export class Branch {
  @PrimaryGeneratedColumn()
  branch_id: number;

  @Column()
  branch_code: string;


  @Column()
  branch_name: string;

  @Column({ default: true })
  branch_isactive: boolean;

  @Column()
  lineoa_id: number;

  @ManyToOne(() => Lineoa, lineoa => lineoa.branches)
  @JoinColumn({ name: 'lineoa_id' }) // maps FK column
  lineoa: Lineoa;
  
  @OneToMany(() => Log, log => log.branch)
  logs: Log[];

  @OneToMany(() => WifiUsage, usage => usage.branch)
  wifiUsages: WifiUsage[];
}
