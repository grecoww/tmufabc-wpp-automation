import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys';
import QRCode from 'qrcode';
import { GetDefaultersFullInfo } from './index.js';

const { saveCreds, state } = await useMultiFileAuthState('auth_wpp');

let sock = makeWASocket({
  auth: state,
});

sock.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect, qr } = update;

  if (qr) {
    console.log(await QRCode.toString(qr, { type: 'terminal' }));
  }

  if (
    connection === 'close' &&
    lastDisconnect?.error?.output?.statusCode ===
      DisconnectReason.restartRequired
  ) {
    sock = makeWASocket({
      auth: state,
    });
  }

  if (connection === 'open') {
    await sendMessage(process.env.MY_PHONENUMBER_TEST, 'Teste');
  }
});

sock.ev.on('creds.update', saveCreds);

async function sendMessage(phoneNumber, message) {
  const jid = '55' + phoneNumber + '@s.whatsapp.net';

  await sock.sendMessage(jid, message);
}
