/// <reference path="./common.d.ts" />

import * as types from "../share/types";
import * as common from "./common";
import * as React from "react";
import * as ReactDOM from "react-dom";
const History = require("history");
const Clipboard = require("clipboard");

const history = History.createHistory();

import {SuccessComponent} from "./success";
import {ErrorComponent} from "./error";
import {NewOrganizationComponent} from "./new_organization";
import {InviteComponent} from "./invite";
import {AccessTokensComponent} from "./access_tokens";
import {AuthorizedComponent} from "./authorized";
import {RegisteredComponent} from "./registered";
import {AuthorizationComponent} from "./authorization";
import {LoginComponent} from "./login";
import {UserComponent} from "./user";
import {ThemesComponent} from "./themes";

import {global} from "./head";

$.ajaxSetup({
    headers: {
        "X-Version": version
    },
    xhrFields: {
        withCredentials: true
    },
});

$(document).ajaxSend(() => {
    if (global.head) {
        global.head.setState({ requestCount: global.head.state.requestCount + 1 });
    }
    if (global.body) {
        global.body.setState({ requestCount: global.body.state.requestCount + 1 });
    }
}).ajaxComplete(() => {
    if (global.head) {
        global.head.setState({ requestCount: global.head.state.requestCount - 1 });
    }
    if (global.body) {
        global.body.setState({ requestCount: global.body.state.requestCount - 1 });
    }
}).ajaxError(() => {
    if (global.head) {
        global.head.showAlert(false, "something happens unexpectedly, see console to get more details.");
    }
});

let clipboard = new Clipboard(".clip");

clipboard.on("success", e => {
    global.head.showAlert(true, "emails copied:" + e.text);
});

global.win = $(window);
global.doc = $(document);

global.win.scroll(() => {
    if (global.scrolled && global.win.scrollTop() >= global.doc.height() - global.win.height()) {
        global.scrolled();
    }
});

socket.on(types.themePushEvents.themeCreated, (theme: types.Theme) => {
    if (global.themeCreated) {
        global.themeCreated(theme);
    }
});

socket.on(types.themePushEvents.themeUpdated, (theme: types.Theme) => {
    if (global.themeUpdated) {
        global.themeUpdated(theme);
    }
});

ReactDOM.render(
    <common.Router history={history}>
        <common.Route path="/" component={ThemesComponent}/>
        <common.Route path="/themes.html" component={ThemesComponent}/>
        <common.Route path="/success.html" component={SuccessComponent}/>
        <common.Route path="/error.html" component={ErrorComponent}/>
        <common.Route path="/new_organization.html" component={NewOrganizationComponent}/>
        <common.Route path="/invite.html" component={InviteComponent}/>
        <common.Route path="/access_tokens.html" component={AccessTokensComponent}/>
        <common.Route path="/authorized.html" component={AuthorizedComponent}/>
        <common.Route path="/registered.html" component={RegisteredComponent}/>
        <common.Route path="/authorization.html" component={AuthorizationComponent}/>
        <common.Route path="/login.html" component={LoginComponent}/>
        <common.Route path="/user.html" component={UserComponent}/>
    </common.Router>,
    document.getElementById("container")
);
