/// <reference path="./IRouter.ts" />
/// <reference path="./IApplication.ts" />
/// <reference path="./pages/IPage.ts" />

import page from "page";
import PasswordPage from "./pages/PasswordPage";
import TopPage from "./pages/TopPage";
import WidgetSamplePage from "./pages/WidgetSample";

export default class Router implements IRouter {
  constructor(app: IApplication) {
    this.addPage("/", () => {
      this.showPage(new TopPage(app));
    });
    this.addPage("/u/:url", (ctx: PageJS.Context) => {
      this.showPage(new PasswordPage(app, ctx.params.url));
    });
    this.addPage("/sample", () => {
      this.showPage(new WidgetSamplePage(app));
    });
  }

  private addPage(path: string, callback: PageJS.Callback) {
    page(path, callback);
    page(`/mokelab.github.io/url_with_password${path}`, callback);
  }

  start(): void {
    page();
  }

  navigate(path: string): void {
    page(path);
  }

  redirect(path: string): void {
    page.redirect(path);
  }

  private showPage(next: IPage) {
    next.onCreate();
  }
}
