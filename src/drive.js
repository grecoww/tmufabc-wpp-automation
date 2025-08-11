// aqui vou usar a estrategia de webscrapping por motivos didaticos (quero aprender a usar cheerio/puppeteer), alem do mais, ja aprendi a usar a api do google em `spreadsheet.js`.
// proximo desafio: implementar apenas com cheerio

import puppeteer from 'puppeteer';
import 'dotenv/config';

export async function scrapFinanceSheetId() {
  const date = new Date();

  const year = date.getFullYear().toString();
  const monthNumber = date.getMonth() + 1;
  const month = monthNumber.toString().padStart(2, '0');
  const monthAlias = getMonthAlias(month);

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(process.env.PASTA_FINANCEIRO);
  await page.waitForNetworkIdle();

  await page.locator(`div ::-p-text(${year})`).setTimeout(3000).click();

  const monthLabel = `${month}.${monthAlias} ${year}`;
  await page.locator(`div ::-p-text(${monthLabel})`).setTimeout(3000).click();

  const target = await browser.waitForTarget(
    (t) => t.url().includes('spreadsheets'),
    {
      timeout: 3000,
    },
  );
  browser.close();

  const sheetId = target.url().match(/\/d\/([^/]+)/)[1];
  return sheetId;
}

function getMonthAlias(monthNumber) {
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];
  return months[monthNumber - 1];
}

if (import.meta.filename === process.argv[1])
  console.log(await scrapFinanceSheetId());
