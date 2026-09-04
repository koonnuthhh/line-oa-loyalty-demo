import { FlexMessage, FlexBubble } from '@line/bot-sdk';

type DatetimePickerAction = {
  type: 'datetimepicker';
  label: string;
  data: string;
  mode: 'date' | 'time' | 'datetime';
  initial?: string;
  max?: string;
  min?: string;
};

export function getDatetimePickerFlexContent(
  title: string,
  label = 'เลือกวันเวลา',
  postbackData = 'action=selectDateTime',
  mode: 'datetime' | 'date' | 'time' = 'datetime',
  initial = '2025-07-08T10:00',
  min = '2024-01-01T00:00',
  max = '2025-12-31T23:59',
): FlexMessage {
  const datetimeAction: DatetimePickerAction = {
    type: 'datetimepicker',
    label,
    data: postbackData,
    mode,
    initial,
    min,
    max,
  };

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
        {
          type: 'button',
          action: datetimeAction,
          style: 'primary',
          color: '#00B900',
        },
      ],
    },
  };

  return {
    type: 'flex',
    altText: title,
    contents,
  };
}
