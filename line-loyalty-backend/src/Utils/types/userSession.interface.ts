//Admin step
export type AdminSessionStep = 'awaitingBranchId';

//Admin
export interface AdminSession {
  action: 'usageLog' | 'resetWifi';
  step: AdminSessionStep;
}
//Customer
export interface CustomerSession {
  action: 'requestWifi' | null;
  step: 'awaitingBranchId' | null;
  profileId?: string;
};

// Cache wifi
export type CachedCustomerPass = {
  username: string;
  password: string;
  Time?: string;
  cachedAt: Date;
};
