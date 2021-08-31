import * as puppeteer from 'puppeteer-core';
import { store } from './../store';
export default async () => {
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222/',
    defaultViewport: null,
  });
  store.setDriver(browser);
  return browser;
};
