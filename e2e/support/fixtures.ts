import { test as base, expect } from "@playwright/test";
import path from "path";

const FIXTURES = path.resolve(__dirname, "../fixtures");

type LoadOpts = {
  query?: string;
  hash?: string;
};

type CartridgeFixtures = {
  loadByUpload: (file: string, opts?: LoadOpts) => Promise<void>;
  loadByUrl: (url: string) => Promise<void>;
};

export const test = base.extend<CartridgeFixtures>({
  loadByUpload: async ({ page }, use) => {
    await use(async (file, opts = {}) => {
      const query = opts.query ? `?${opts.query}` : "";
      await page.goto(`/${query}${opts.hash ?? ""}`);
      await page.setInputFiles('input[type="file"]', path.join(FIXTURES, file));
    });
  },
  loadByUrl: async ({ page }, use) => {
    await use(async (url) => {
      await page.goto(url);
    });
  },
});

export { expect };
