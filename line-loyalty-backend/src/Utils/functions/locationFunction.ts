import { FlexMessage, FlexBubble, FlexText, FlexButton } from '@line/bot-sdk';
import { ServiceCenterType, ServiceCenterWithDistance } from '../types/serviceCenter.interface';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function findNearbyServiceCenters(userLat: number, userLng: number, centers: ServiceCenterType[], maxDistanceKm, limit 
): Promise<ServiceCenterWithDistance[]> {
  return centers
    .map(center => ({
      ...center,
      distance: haversineDistance(userLat, userLng, center.lat, center.lng),
    }))
    .filter(center => center.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

// Flex to send nearby location
export function buildNearbyLocationFlex(centers: ServiceCenterWithDistance[]): FlexMessage {
  const bubbles: FlexBubble[] = centers.slice(0, 10).map(center => {
    const bodyContents: FlexText[] = [
      {
        type: 'text',
        text: center.name,
        weight: 'bold',
        size: 'md',
        wrap: true,
      },
      {
        type: 'text',
        text: center.address,
        size: 'sm',
        color: '#666666',
        wrap: true,
      },
      {
        type: 'text',
        text: `📍 ระยะทาง: ${center.distance?.toFixed(2)} กม.`,
        size: 'sm',
        color: '#999999',
        wrap: true,
      },
    ];

    if (center.phone) {
      bodyContents.push({
        type: 'text',
        text: `📞 โทร: ${center.phone}`,
        size: 'sm',
        color: '#999999',
        wrap: true,
      });
    }

    const footerContents: FlexButton[] = [
      {
        type: 'button',
        style: 'link',
        color: '#00B900',
        action: {
          type: 'uri',
          label: 'ดูแผนที่',
          uri: `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`,
        },
      },
    ];

    if (center.phone) {
      footerContents.push({
        type: 'button',
        style: 'primary',
        color: '#00B900',
        action: {
          type: 'uri',
          label: 'โทร',
          uri: `tel:${center.phone}`,
        },
      });
    }

    return {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: bodyContents,
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: footerContents,
      },
    };
  });

  return {
    type: 'flex',
    altText: 'ศูนย์บริการใกล้คุณ',
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}