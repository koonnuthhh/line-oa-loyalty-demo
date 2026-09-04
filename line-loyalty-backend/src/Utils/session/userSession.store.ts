import { AdminSession, CachedCustomerPass, CustomerSession } from "../types/userSession.interface";

const adminSessionMap = new Map<string, AdminSession>();
const customerSessionMap = new Map<string, CustomerSession>();

//ADMIN SESSION
export function setAdminSession(userId: string, session: AdminSession) {
  adminSessionMap.set(userId, session);
}

export function getAdminSession(userId: string): AdminSession | undefined {
  return adminSessionMap.get(userId);
}

export function clearAdminSession(userId: string) {
  adminSessionMap.delete(userId);
}


//USER SESSION
export function setCustomerSession(userId: string, session: CustomerSession) {
  customerSessionMap.set(userId, session);
}

export function getCustomerSession(userId: string): CustomerSession | null {
  return customerSessionMap.get(userId) || null;
}

export function clearCustomerSession(userId: string) {
  customerSessionMap.delete(userId);
}

////////////////////// CACHE /////////////////////////////////

const customerPassCache = new Map<string, CachedCustomerPass>();

export function setCustomerPassCache(key: string, data: CachedCustomerPass) {
  customerPassCache.set(key, data);
}

export function getCustomerPassCache(key: string): CachedCustomerPass | null {
  return customerPassCache.get(key) || null;
}

export function clearCustomerPassCache(key: string) {
  customerPassCache.delete(key);
}

export async function handleCustomerAccess(){

return;
}
