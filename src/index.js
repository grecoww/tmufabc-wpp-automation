import { scrapFinanceSheetId } from './drive.js';
import { getDefaultersInfo } from './spreadsheet.js';
import { initWpp, sendWppMessage } from './wpp.js';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const sock = await initWpp();
  const financeSheetId = await scrapFinanceSheetId();

  const defaulters = await getDefaultersInfo(
    financeSheetId,
    process.env.PLANILHA_INFO_ATLETAS,
  );

  for (const defaulter of defaulters) {
    const phoneNumber = defaulter.phoneNumber;
    const name = defaulter.nickname ?? defaulter.name;

    if (!phoneNumber) {
      console.warn(`Número de telefone ausente para ${name}. Pulando...`);
      continue;
    }

    const message = `Oi, ${name}! Tudo bem? 😊 Passando só pra lembrar da mensalidade do tênis de mesa desse mês. Qualquer dúvida ou se precisar de algo, é só avisar. Valeu!`;

    console.log(
      `Enviando mensagem para ${defaulter.name}:${defaulter.nickname} (${phoneNumber})...`,
    );
    await sendWppMessage(sock, phoneNumber, message);

    await sleep(15000);
  }
}

main().catch((err) => {
  console.error('Error:', err);
});
