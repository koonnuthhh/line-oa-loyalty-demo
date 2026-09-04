import type { FlexMessage, FlexBubble, FlexButton } from '@line/bot-sdk';
import { ButtonOption, PostbackCard, WebsiteCard } from '../types/flexMessage.interface';

const buttoncolor = '#000000'; // Primary color for buttons

export function getButtonOptionsFlexContent(
  title: string,
  options: ButtonOption[]
): FlexMessage {
  const buttonComponents: FlexButton[] = options.map(({ label, postbackData }) => ({
    type: 'button',
    action: {
      type: 'postback',
      label,
      data: postbackData,
    },
    style: 'primary',
    color: buttoncolor,
  }));

  const contents: FlexBubble = {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      contents: [
        {
          type: 'text',
          text: title,
          weight: 'bold',
          size: 'xl',
        },
        ...buttonComponents,
      ],
    },
  };

  return {
    type: 'flex',
    altText: title,
    contents,
  };
}

export function getLocationRequestFlex(): FlexMessage {
  return {
    type: 'flex',
    altText: 'โปรดแชร์ตำแหน่งของคุณ',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: '📍 กรุณาส่งตำแหน่งของคุณ',
            weight: 'bold',
            size: 'lg',
            wrap: true
          },
          {
            type: 'text',
            text: 'แตะปุ่มด้านล่างเพื่อเปิดแผนที่และแชร์ตำแหน่งของคุณกับเรา',
            size: 'sm',
            wrap: true
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: buttoncolor,
            action:
              {
                type: 'uri',
                label: 'ส่งตำแหน่ง',
                uri: 'line://nv/location'
              }
          }
        ]
      }
    }
  };
}

// Card message
export function websiteCarouselFlexContent(
  altText: string,
  cards: WebsiteCard[],
  label: string = 'ข้อมูลผลิตภัณฑ์'
): FlexMessage {
  const bubbles: FlexBubble[] = cards.map(({ title, imageUrl, location, url }) => ({
    type: 'bubble',
    hero: {
      type: 'image',
      url: imageUrl,
      size: 'full',
      aspectRatio: '1:1',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'text',
          text: title,
          weight: 'bold',
          size: 'md',
          wrap: true,
        },
        {
          type: 'text',
          text: location,
          size: 'sm',
          color: buttoncolor,
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          action: {
            type: 'uri',
            label: label,
            uri: url,
          },
          style: 'link',
        },
      ],
    },
  }));

  return {
    type: 'flex',
    altText,
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}

export function PostbackCarouselFlexContent(
  altText: string,
  cards: PostbackCard[],
  label: string = 'เลือกแบรนด์บริการนี้'
): FlexMessage {
  const bubbles: FlexBubble[] = cards.map(({ title, imageUrl, location, postbackData }) => ({
    type: 'bubble',
    hero: {
      type: 'image',
      url: imageUrl,
      size: 'full',
      aspectRatio: '1:1',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'text',
          text: title,
          weight: 'bold',
          size: 'md',
          wrap: true,
        },
        {
          type: 'text',
          text: location,
          size: 'sm',
          color: buttoncolor,
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          action: {
            type: 'postback',
            label: label,
            data: postbackData,
          },
          style: 'link',
        },
      ],
    },
  }));

  return {
    type: 'flex',
    altText,
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}

