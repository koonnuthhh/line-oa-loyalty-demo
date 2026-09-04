import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Branch } from './branch.entity';
import { WifiProfile } from './wifi-profile.entity';

@Entity('wifihotspot_wifi_usage')
export class WifiUsage {
  @PrimaryColumn()
  branch_id: number;

  @PrimaryColumn()
  wifi_profile_id: number;

  @Column()
  wifi_usage_count: number;

  @ManyToOne(() => Branch, branch => branch.wifiUsages)
  @JoinColumn({name:"branch_id"})
  branch: Branch;

  @ManyToOne(() => WifiProfile, profile => profile.usages)
  @JoinColumn({name:"wifi_profile_id"})
  wifiProfile: WifiProfile;
}
