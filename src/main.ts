import Application from "./Application";
import Models from "./models/Models";
import Router from "./Router";
import Services from "./services/Services";
import XHRClient from "./clients/XHRClient";
import AccessToken from "./models/token/AccessToken";

import "./scss/index.scss";
import { Drawer } from "./views/Drawer";
import { AppBar } from "./views/AppBar";
import Ractive from "ractive";
import { FlatButton, RaisedButton } from "./views/Button";
import { TextField } from "./views/TextField";
import Loading from "./views/Loading";

Ractive.components = {
    RaisedButton: RaisedButton,
    FlatButton: FlatButton,
    TextField: TextField,
    Loading: Loading,
};

const token = new AccessToken();
const client = new XHRClient("json");
const models = new Models(client, token);
const services = new Services(models);
const app = new Application(
    new XHRClient("text"),
    services,
    (a: IApplication) => {
        return new Router(a);
    },
    (app: IApplication) => {
        return new Drawer(app);
    },
    (drawer: IDrawer) => {
        return new AppBar(drawer);
    }
);

app.start();
