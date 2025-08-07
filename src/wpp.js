import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys';
import QRCode from 'qrcode';
import { GetDefaultersInfo } from './google.js';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function initWpp() {
  const { saveCreds, state } = await useMultiFileAuthState('auth_wpp');

  const sock = makeWASocket({
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
      await initWpp();
    }

    if (connection === 'open') {
      for (const defaulterInfo of await GetDefaultersInfo()) {
        const phoneNumber = defaulterInfo.phoneNumber;
        const name = defaulterInfo.nickname ?? defaulterInfo.name;

        const message = `Oi, ${name}! Tudo bem? 😊 Passando só pra lembrar da mensalidade do tênis de mesa desse mês. Qualquer dúvida ou se precisar de algo, é só avisar. Valeu!`;

        await sendWppMessage(sock, phoneNumber, message);
        await sleep(15000);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

async function sendWppMessage(sock, phoneNumber, message) {
  const jid = '55' + phoneNumber + '@s.whatsapp.net';
  await sock.sendMessage(jid, { text: message }).catch((err) => ({
    message: `Erro ao enviar cobrança para ${phoneNumber}`,
    error: err,
  }));
}

await initWpp();
