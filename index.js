import 'dotenv/config';
import token from './token.json' with { type: 'json' };
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const client = google.auth.fromJSON(token);
client.scopes = SCOPES;

const sheets = google.sheets({
  version: 'v4',
  auth: client,
});

const res = await sheets.spreadsheets.values.get({
  spreadsheetId: process.env.PLANILHA_INFO_ATLETAS,
  range: 'Página1!B2:B',
});
console.log(res.data.values);
