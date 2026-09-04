import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, ReturnDocument } from 'typeorm';

import { Admin } from '../entities/admin.entity';
import { Branch } from '../entities/branch.entity';
import { WifiUsage } from '../entities/wifi-usage.entity';
import { WifiCredential } from '../entities/wifi-credential.entity';
import { GetLogsDTO, GetWifiDTO, ResetWifiDTO } from './dto/formatted.dto';
import { Lineoa, Log } from 'src/entities';
import { profile, time } from 'console';
import { Raw } from 'typeorm';

//.lowercase(all)



@Injectable()
export class HotspotService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Lineoa)
    private readonly lineoaRepo: Repository<Lineoa>,
    @InjectRepository(Log)
    private readonly logRepo: Repository<Log>,
    @InjectRepository(WifiUsage)
    private readonly wifiUsageRepo: Repository<WifiUsage>,
    @InjectRepository(WifiCredential)
    private readonly wifiCredentialRepo: Repository<WifiCredential>,
  ) { }

  async checkAdmin(userId: string, lineoa_uid: string): Promise<boolean> {
    //const branch = await this.branchRepo.findOneBy({ branch_code: lineoa_uid });
    //if (!branch) return false;

    const admin = await this.adminRepo.findOneBy({
      admin_uid: userId,
      lineoa_uid: lineoa_uid,
    });

    return !!admin;
  }


  async assignNextWifiCredential(@Body() body: GetWifiDTO) {
    console.log(body)
    const Lineid = await this.lineoaRepo.findOne({
      where: {
        lineoa_uid: body.user.destination
      }
    })
    console.log(Lineid)
    let profileid = 1
    if (body.user.branchId[0].toLocaleLowerCase() == 'v') {
      profileid = 2;
    } else if (body.user.branchId[0].toLocaleLowerCase() == 'e') {
      profileid = 3;
    }
    const branchCode =
      profileid === 2 || profileid === 3
        ? body.user.branchId.slice(1)
        : body.user.branchId;


    const branch = await this.branchRepo.findOne({
      where: {
        branch_code: branchCode,
        lineoa_id: Lineid.lineoa_id,
      },
      relations: ['wifiUsages'],
    });


    if (!branch) {
    console.log('Branch not found for:', {
      branchCode,
      lineoa_id: Lineid?.lineoa_id,
    });
    throw new NotFoundException({ Text: 'Branch not found' });
  }

    const usage = branch.wifiUsages.find(
      (u) => u.wifi_profile_id === +profileid,
    );
if (!usage) {
    console.log('Wifi usage not found in branch.wifiUsages:', {
      profileid,
      allUsages: branch.wifiUsages.map(u => u.wifi_profile_id),
    });
    throw new NotFoundException({ Text: 'Wifi usage for this profile not found' });
  }
    const credential = await this.wifiCredentialRepo.findOne({
      where: {
        wifi_profile_id: +profileid,
        wifi_credential_id: MoreThan(usage.wifi_usage_count),
        wifi_credential_isactive: true,
      },
      relations:['wifiProfile'],
    });

  if (!credential) {
    console.log('Credential not found:', {
      profileid,
      currentUsageCount: usage.wifi_usage_count,
    });
    throw new NotFoundException({ Text: 'No available credentials at this index' });
  }
    usage.wifi_usage_count = credential.wifi_credential_id;
    await this.wifiUsageRepo.save(usage);

    this.saveLogs(body.content.formattedDate,
      credential.wifi_credential_username,
      body.user.destination,
      branch.branch_name,
      body.user.userId,
      branch.branch_code,
      body.user.username
    );

    return {
      username: credential.wifi_credential_username,
      password: credential.wifi_credential_password,
      Time: credential.wifiProfile.wifi_profile_uptime_limit,
    };
  }

  async saveLogs(formatteddate: string, wifi_username: string, lineoa_uid: string, branch_name: string, user_uid: string, branch_code: string, username: string) {
    const [datePart, timePart] = formatteddate.split(" ");
    const line = await this.lineoaRepo.findOne({
      where: {
        lineoa_uid: lineoa_uid,
      },
    });
    if (!line) {
      throw new NotFoundException({ Text: 'Can not find this lineOA uid' })
    }
    const log = new Log();
    log.date = datePart;
    log.time = timePart;
    log.wifi_username = wifi_username;
    log.branch_code = branch_code;
    log.branch_name = branch_name;
    log.lineoa_uid = lineoa_uid;
    log.lineoa_name = line.lineoa_name;
    log.user_uid = user_uid;
    log.user_name = username;

    await this.logRepo.save(log);
  }


  async getLogs(@Body() body: GetLogsDTO) {
    let logs: Log[];

    // === CASE 1: All Logs ===
    if (body.user.branchId.toLowerCase() === 'all') {
      logs = await this.logRepo.find({
        where: {
          lineoa_uid: body.user.destination
        },
        order: { log_id: 'DESC' },
        take: 50,
      });
    } else {
      // === CASE 2: Logs by branch + destination ===
      logs = await this.logRepo.find({
        where: {
          lineoa_uid: body.user.destination,
          branch_code: body.user.branchId, // ensure number type
        },
        order: { log_id: 'DESC' },
        take: 50,
      });

      if (!logs || logs.length === 0) {
        throw new NotFoundException({ Text: "Branch code doesn't match or no logs found" });
      }
    }

    // === Format logs as strings ===
    const formatted = logs.map(log => {
      const dateStr = new Date(log.date).toLocaleDateString('en-GB'); // "DD/MM/YYYY"
      return `ID:${log.log_id} Date:${dateStr} Time:${log.time} Username:${log.user_name} Wifisername:${log.wifi_username} Branch:${log.branch_name}(${log.branch_code}) Company:${log.lineoa_name}`;
    });

    return { logs: formatted };
  }

  async resetWifi(@Body() body: ResetWifiDTO) {
    if (body.user.branchId.toLowerCase() === 'all') {
      const line = await this.lineoaRepo.findOne({
        where: {
          lineoa_uid: body.user.destination
        }, relations: ['branches', 'branches.wifiUsages'],
      });
      const allusage = [];
      for (const branch of line.branches) {
        for (const log of branch.wifiUsages) {
          log.wifi_usage_count = 0;
          allusage.push(log);
        }

      }
      await this.wifiUsageRepo.save(allusage);
      return { Text: "Reset all quota already" };

    } else {
      // === CASE 2: Logs by branch + destination ===
      const line = await this.lineoaRepo.findOne({
        where: {
          lineoa_uid: body.user.destination,
        },
        relations: ['branches'],
      });
      if (!line)
        throw new NotFoundException({ Text: "Can not find this Line in database" });

      const branch = line.branches.find(
        (b) => b.branch_code === body.user.branchId
      );
      if (!branch)
        throw new NotFoundException({ Text: "Can not find Branch" });

      const usage = await this.wifiUsageRepo.find({
        where: {
          branch_id: branch.branch_id,
        },
      });

      for (const u of usage) {
        u.wifi_usage_count = 0;
      }
      await this.wifiUsageRepo.save(usage);

      return { Text: `Reset branch ${branch.branch_name} company ${line.lineoa_name} success` };
    }


  }

  async saveSpameLogs(@Body() body: GetWifiDTO) {
    const [datePart, timePart] = body.content.formattedDate.split(" ");
    const savedlog = await this.logRepo.findOne({
      where: {
        user_uid: body.user.userId,
      },
      order: {
        log_id: 'DESC',
      },
    });
    if (!savedlog) {
      throw new NotFoundException({ Text: 'Logs not found' });
    }
    const log = new Log();
    log.date = datePart;
    log.time = timePart;
    log.wifi_username = "This user is spamming";
    log.branch_code = savedlog.branch_code;
    log.branch_name = savedlog.branch_name;
    log.lineoa_uid = body.user.destination;
    log.lineoa_name = savedlog.lineoa_name;
    log.user_uid = body.user.userId;
    log.user_name = body.user.username;

    await this.logRepo.save(log);
    return { Text: "Not Exceed Hour" }
  }

  async findAllUidsFromLineOaUid(lineoaUid: string): Promise<string[]> {
  const records = await this.adminRepo.find({
    where: {
      lineoa_uid: lineoaUid,
    },
    select: ['admin_uid'],
  });

  return records.map((r) => r.admin_uid);
}


}

