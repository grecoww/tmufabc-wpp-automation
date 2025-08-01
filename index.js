import 'dotenv/config';
import token from './token.json' with { type: 'json' };
import { google } from 'googleapis';
import Fuse from 'fuse.js';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const client = google.auth.fromJSON(token);
client.scopes = SCOPES;

const sheets = google.sheets({
  version: 'v4',
  auth: client,
});

async function GetDefaultersNames() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.PLANILHA_PAGAMENTO_ATLETAS,
    range: 'Mensalidades!B5:E',
  });
  const paymentsInfo = res.data.values;

  const parsedPaymentsInfo = paymentsInfo
    .filter((row) => {
      return (
        !!row[0] &&
        row[0] !== '#N/A' &&
        row[0] !== 'Total' &&
        row[3] === 'Não Pago'
      );
    })
    .map((row) => {
      return row[0];
    });
  return parsedPaymentsInfo;
}

async function GetUsersInfo(nameArray) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.PLANILHA_INFO_ATLETAS,
    range: 'Página1!B2:F',
  });
  const usersInfo = res.data.values;

  const options = {
    keys: [[0]],
    ignoreDiacritics: true,
    includeScore: true,
    minMatchCharLength: 3,
  };
  const fuse = new Fuse(usersInfo, options);

  let targetInfoList = [];
  for (const name of nameArray) {
    const result = fuse.search(name);
    const parsedResult = result[0].item;

    const targetInfo = {
      name: parsedResult[0],
      nickname: parsedResult[1] || null,
      phoneNumber: parsedResult[4],
    };
    targetInfoList.push(targetInfo);
  }

  return targetInfoList;
}

export async function GetDefaultersFullInfo() {
  const defaultersNames = await GetDefaultersNames();

  const defaultersInfos = await GetUsersInfo(defaultersNames);

  return defaultersInfos;
}
