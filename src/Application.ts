/// <reference path="./IApplication.ts" />
/// <reference path="./services/IServices.ts" />
/// <reference path="./clients/HTTPClient.ts" />

import { MDCSnackbar } from "@material/snackbar";
import { getBody, isStatus200 } from "./clients/Functions";

export default class Application implements IApplication {
  private templateClient: HTTPClient;
  private router: IRouter;
  services: IServices;
  appBar: IAppBar;
  drawer: IDrawer;
  private snackBar: MDCSnackbar;

  constructor(
    templateClient: HTTPClient,
    services: IServices,
    routerFactory: (app: IApplication) => IRouter,
    drawerFactory: (app: IApplication) => IDrawer,
    appBarFactory: (drawer: IDrawer) => IAppBar
  ) {
    this.templateClient = templateClient;
    this.services = services;
    this.router = routerFactory(this);

    this.drawer = drawerFactory(this);
    this.appBar = appBarFactory(this.drawer);
    this.appBar.setHasDrawer(false);
    this.snackBar = new MDCSnackbar(document.querySelector(".mdc-snackbar")!);
  }

  start() {
    this.router.start();
  }

  fetchTemplate(name: string): Promise<string> {
    const url = `/url_with_password/pages/${name}`;
    return this.templateClient
      .send(Method.GET, url, {}, null)
      .then(isStatus200)
      .then(getBody);
  }

  navigate(path: string): void {
    this.router.navigate(path);
  }

  redirect(path: string): void {
    this.router.redirect(path);
  }

  showMessage(msg: string): void {
    (<any>this.snackBar).labelText = msg;
    (<any>this.snackBar).open();
  }
}
