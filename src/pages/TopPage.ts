/// <reference path="./IPage.ts" />
import Ractive from "ractive";
import * as CryptoJS from "crypto-js";

export default class TopPage implements IPage {
  private app: IApplication;
  private ractive!: Ractive;

  constructor(app: IApplication) {
    this.app = app;
  }
  async onCreate() {
    const t = await this.app.fetchTemplate("top.html");
    this.ractive = new Ractive({
      el: "#container",
      template: t,
      data: {
        error: "",
        encrypted: "",
      },
      on: {
        create: () => this.create(),
        copy: () => this.copy(),
      },
    });
  }

  private async create() {
    const url = this.ractive.get("url") as string;
    const password = this.ractive.get("password");

    if (!url.startsWith("https://")) {
      this.ractive.set({
        error: "invalid url",
      });
      return;
    }
    const data = url.substring("https://".length);

    const str = CryptoJS.AES.encrypt(data, password).toString();
    const str2 = str.replace(/\//g, ":");
    const encrypted = encodeURIComponent(str2);
    this.ractive.set({
      error: "",
      encrypted: `https://mokelab.github.io/url_with_password/u/${encrypted}`,
    });
  }

  private async copy() {
    const url = this.ractive.get("encrypted");
    try {
      await window.navigator.clipboard.writeText(url);
      this.app.showMessage("Copied to Clipboard");
    } catch (e) {
      this.app.showMessage(JSON.stringify(e));
    }
  }
}
