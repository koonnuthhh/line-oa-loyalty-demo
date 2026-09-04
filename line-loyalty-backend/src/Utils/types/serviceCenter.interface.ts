
export interface ServiceCenterType {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string; 
}

export interface ServiceCenterWithDistance extends ServiceCenterType {
  distance: number;
}