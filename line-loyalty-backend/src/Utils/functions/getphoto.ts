// utils/fetchAirtableImages.ts
import axios from 'axios';
import { AirtableConfig } from '../types/Config_Aritables.interface';

export async function fetchAirtableImages(tag?: string, configs?: AirtableConfig): Promise<any[]> {
  const token = configs?.token as string;
  const baseId = configs?.baseId as string;
  const tableName = configs?.tableName as string;

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const records = res.data.records.map((record: any) => {
      const fields = record.fields;
      return {
        name: fields['Name'],
        imageUrl: fields['Photo']?.[0]?.url || null,
        description: fields['Description'] || '',
        tags: fields['Tags'] || [],
        album: fields['Album'] || '',
      };
    });

    if (tag) {
      return records.filter((r) => r.tags.includes(tag));
    }
    return records;
  } catch (error: any) {
    console.error('Airtable fetch error:', error.response?.data || error.message);
    throw error;
  }
}
