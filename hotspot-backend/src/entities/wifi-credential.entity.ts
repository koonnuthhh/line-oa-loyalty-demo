import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WifiProfile } from './wifi-profile.entity';

@Entity('wifihotspot_wifi_credential')
export class WifiCredential {
  @PrimaryGeneratedColumn()
  wifi_credential_id: number;

  @Column()
  wifi_profile_id: number;

  @Column()
  wifi_credential_username: string;

  @Column()
  wifi_credential_password: string;

  @Column({ default: true })
  wifi_credential_isactive: boolean;

  @ManyToOne(() => WifiProfile, profile => profile.credentials)
  @JoinColumn({name:"wifi_profile_id"})
  wifiProfile: WifiProfile;
}
