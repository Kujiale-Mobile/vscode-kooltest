import * as puppeteer from "puppeteer-core";
const findChrome = require("carlo/lib/find_chrome");
let browser: puppeteer.Browser;
class Spider {
  async buildPage({ url, timeout = 500 }: { url: string; timeout: number }) {
    if(!browser) {
      let findChromePath = await findChrome({});
      let executablePath = findChromePath.executablePath;
      browser = await puppeteer.launch({
        executablePath,
        headless: true,
      });
    }
    const page = await browser.newPage();
    await page.goto("file://" + url);
    
    if (timeout) {
      await page.waitFor(Number(timeout));
    }
    return page.content();
  }
}

export default new Spider();
