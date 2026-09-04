import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Admin } from './entities/admin.entity';
import { Branch } from './entities/branch.entity';
import { Lineoa } from './entities/lineoa.entity';
import { Log } from './entities/log.entity';
import { Sale } from './entities/sale.entity';
import { WifiCredential } from './entities/wifi-credential.entity';
import { WifiProfile } from './entities/wifi-profile.entity';
import { WifiUsage } from './entities/wifi-usage.entity';

/**
 * Demo seed — runs ONLY when DB_MODE=demo (in-memory SQLite, no database server).
 * Inserts clearly fictional rows so every API endpoint has data to answer with.
 * Exported constants are the values you paste into Swagger/curl for the demo.
 */
export const DEMO_LINEOA_UID = 'Udemolineoa1';
export const DEMO_ADMIN_UID = 'Udemoadmin1';
export const DEMO_CUSTOMER_UID = 'Udemocustomer1';

@Injectable()
export class DemoSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger('DemoSeed');

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    if (process.env.DB_MODE !== 'demo') return;

    const lineoaRepo = this.dataSource.getRepository(Lineoa);
    if ((await lineoaRepo.count()) > 0) return;

    // Legacy join columns (e.g. admin.lineoa_uid, log.branch_code) don't match
    // TypeORM's inferred PK relations, so disable FK enforcement in the demo DB.
    await this.dataSource.query('PRAGMA foreign_keys = OFF');

    const lineoa = await lineoaRepo.save(
      lineoaRepo.create({
        lineoa_uid: DEMO_LINEOA_UID,
        lineoa_name: 'Aurora Wi-Fi Demo',
        lineoa_isactive: true,
        lineoa_remark: 'In-memory demo data - restarting the app resets everything',
      }),
    );

    const profileRepo = this.dataSource.getRepository(WifiProfile);
    const profiles = await profileRepo.save([
      profileRepo.create({ wifi_profile_setting: 'Standard', wifi_profile_speed_limit: '20 Mbps', wifi_profile_uptime_limit: '120 นาที' }),
      profileRepo.create({ wifi_profile_setting: 'VIP', wifi_profile_speed_limit: '50 Mbps', wifi_profile_uptime_limit: '240 นาที' }),
      profileRepo.create({ wifi_profile_setting: 'Event', wifi_profile_speed_limit: '10 Mbps', wifi_profile_uptime_limit: '60 นาที' }),
    ]);

    const branchRepo = this.dataSource.getRepository(Branch);
    const branches = await branchRepo.save([
      branchRepo.create({ branch_code: 'B1', branch_name: 'Aurora Demo Branch 1', branch_isactive: true, lineoa_id: lineoa.lineoa_id }),
      branchRepo.create({ branch_code: '1002', branch_name: 'Aurora VIP Branch', branch_isactive: true, lineoa_id: lineoa.lineoa_id }),
    ]);

    const usageRepo = this.dataSource.getRepository(WifiUsage);
    const usageRows: WifiUsage[] = [];
    for (const branch of branches) {
      for (const profile of profiles) {
        usageRows.push(
          usageRepo.create({ branch_id: branch.branch_id, wifi_profile_id: profile.wifi_profile_id, wifi_usage_count: 0 }),
        );
      }
    }
    await usageRepo.save(usageRows);

    const credentialRepo = this.dataSource.getRepository(WifiCredential);
    const credentialRows: WifiCredential[] = [];
    const makeCred = (profileId: number, n: number) => {
      for (let i = 1; i <= n; i++) {
        credentialRows.push(
          credentialRepo.create({
            wifi_profile_id: profileId,
            wifi_credential_username: `demo-wifi-${profileId}-${String(i).padStart(2, '0')}`,
            wifi_credential_password: `demo-pass-${profileId}-${String(i).padStart(2, '0')}`,
            wifi_credential_isactive: true,
          }),
        );
      }
    };
    makeCred(profiles[0].wifi_profile_id, 5);
    makeCred(profiles[1].wifi_profile_id, 3);
    makeCred(profiles[2].wifi_profile_id, 3);
    await credentialRepo.save(credentialRows);

    await this.dataSource.getRepository(Admin).save(
      this.dataSource.getRepository(Admin).create({
        admin_uid: DEMO_ADMIN_UID,
        lineoa_uid: DEMO_LINEOA_UID,
      }),
    );

    await this.dataSource.getRepository(Sale).save(
      this.dataSource.getRepository(Sale).create({
        sale_uid: DEMO_ADMIN_UID,
        sale_displayname: 'Demo Sales - Aurora',
        lineoa_id: lineoa.lineoa_id,
      }),
    );

    const logRepo = this.dataSource.getRepository(Log);
    await logRepo.save([
      logRepo.create({
        date: '09/05/2026', time: '09:30', wifi_username: 'demo-wifi-1-01',
        lineoa_name: lineoa.lineoa_name, user_name: 'demo-user-a', branch_name: branches[0].branch_name,
        lineoa_uid: DEMO_LINEOA_UID, user_uid: DEMO_CUSTOMER_UID, branch_code: branches[0].branch_code,
      }),
      logRepo.create({
        date: '09/05/2026', time: '10:15', wifi_username: 'demo-wifi-1-02',
        lineoa_name: lineoa.lineoa_name, user_name: 'demo-user-b', branch_name: branches[0].branch_name,
        lineoa_uid: DEMO_LINEOA_UID, user_uid: DEMO_CUSTOMER_UID, branch_code: branches[0].branch_code,
      }),
    ]);

    this.logger.log('Demo data seeded (in-memory DB). DEMO_LINEOA_UID=' + DEMO_LINEOA_UID);
  }
}
