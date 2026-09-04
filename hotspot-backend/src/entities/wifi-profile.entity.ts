import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WifiUsage } from './wifi-usage.entity';
import { WifiCredential } from './wifi-credential.entity';

@Entity('wifihotspot_wifi_profile')
export class WifiProfile {
  @PrimaryGeneratedColumn()
  wifi_profile_id: number;

  @Column()
  wifi_profile_setting: string;

  @Column()
  wifi_profile_speed_limit: string;

  @Column()
  wifi_profile_uptime_limit: string;

  @OneToMany(() => WifiUsage, usage => usage.wifiProfile)
  usages: WifiUsage[];

  @OneToMany(() => WifiCredential, credential => credential.wifiProfile)
  credentials: WifiCredential[];
}
