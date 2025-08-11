import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys';
import QRCode from 'qrcode';

export async function initWpp() {
  const { saveCreds, state } = await useMultiFileAuthState('auth_wpp');

  const sock = makeWASocket({
    auth: state,
  });

  const ready = new Promise((resolve) => {
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
        console.log('Reiniciando socket');
        return resolve(await initWpp());
      }

      if (connection === 'open') {
        console.log('Socket pronto para ser retornado');
        return resolve(sock);
      }
    });
  });

  sock.ev.on('creds.update', saveCreds);

  return ready;
}

export async function sendWppMessage(sock, phoneNumber, message) {
  const jid = '55' + phoneNumber + '@s.whatsapp.net';
  await sock.sendMessage(jid, { text: message }).catch((err) => ({
    message: `Erro ao enviar cobrança para ${phoneNumber}`,
    error: err,
  }));
}
