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
  spreadsheetId: '1aWnjXSqLQg7Bif8_gnLMP499KIqJrvq_yj0oal8Q0Y4',
  range: 'default!A1:B2',
});
console.log(res.data.values[0]);
