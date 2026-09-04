// config/airtable.config.ts
import * as dotenv from 'dotenv';
import { AirtableConfig } from '../src/Utils/types/Config_Aritables.interface';
dotenv.config();

export const  airtable: AirtableConfig = {
    token: process.env.Token_ARITABLE as string ,
    baseId: process.env.ARITABLES_ID as string ,
    tableName: process.env.ARITABLES_NAMES as string,
  };
