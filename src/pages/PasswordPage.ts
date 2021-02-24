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

    const bytes = CryptoJS.AES.decrypt(this.data, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const decrypted2 = decrypted.replace(/:/g, "/");
    this.ractive.set({
      error: "",
      url: `https://${decrypted2}`,
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
