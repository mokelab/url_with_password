/// <reference path="./IPage.ts" />
import Ractive from "ractive";
import * as CryptoJS from "crypto-js";

export default class PasswordPage implements IPage {
  private ractive!: Ractive;

  constructor(private app: IApplication, private data: string) {}
  async onCreate() {
    const t = await this.app.fetchTemplate("password.html");
    this.ractive = new Ractive({
      el: "#container",
      template: t,
      data: {
        error: "",
        url: "",
      },
      on: {
        decrypt: () => this.decrypt(),
        copy: () => this.copy(),
      },
    });
  }

  private async decrypt() {
    const password = this.ractive.get("password");

    const src = this.data.replace(/:/g, "/");
    const bytes = CryptoJS.AES.decrypt(src, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    this.ractive.set({
      error: "",
      url: `https://${decrypted}`,
    });
  }

  private async copy() {
    const url = this.ractive.get("url");
    try {
      await window.navigator.clipboard.writeText(url);
      this.app.showMessage("Copied to Clipboard");
    } catch (e) {
      this.app.showMessage(JSON.stringify(e));
    }
  }
}
