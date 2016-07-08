/// <reference path="./common.d.ts" />

import * as common from "./common";
import * as React from "react";
import { renderToString } from "react-dom/server";

import { SuccessComponent } from "./success";
import { ErrorComponent } from "./error";
import { NewOrganizationComponent } from "./new_organization";
import { InviteComponent } from "./invite";
import { AccessTokensComponent } from "./access_tokens";
import { AuthorizedComponent } from "./authorized";
import { RegisteredComponent } from "./registered";
import { AuthorizationComponent } from "./authorization";
import { LoginComponent } from "./login";
import { UserComponent } from "./user";
import { ThemesComponent } from "./themes";

const routes = [
    <common.Route path="/" component={ThemesComponent}/>,
    <common.Route path="/themes.html" component={ThemesComponent}/>,
    <common.Route path="/success.html" component={SuccessComponent}/>,
    <common.Route path="/error.html" component={ErrorComponent}/>,
    <common.Route path="/new_organization.html" component={NewOrganizationComponent}/>,
    <common.Route path="/invite.html" component={InviteComponent}/>,
    <common.Route path="/access_tokens.html" component={AccessTokensComponent}/>,
    <common.Route path="/authorized.html" component={AuthorizedComponent}/>,
    <common.Route path="/registered.html" component={RegisteredComponent}/>,
    <common.Route path="/authorization.html" component={AuthorizationComponent}/>,
    <common.Route path="/login.html" component={LoginComponent}/>,
    <common.Route path="/user.html" component={UserComponent}/>,
];

/**
 * tips:
 * 1. change configuration nginx to let `*.html` handled by backends
 * 2. use a template engine, like `ejs`, the template should be the generated html(extension name changed, and delimiters changed)
 * 3. backends add modules of `react`, `react-dom`, `history` and `react-router`
 * 4. for requests of `*.html`, handle them like below
 */
common.match({ routes, location: "/" }, (error: Error, redirectLocation: string, renderProps: any[]) => {
    if (error) {
        console.log(error);
        return;
    }
    if (redirectLocation) {
        console.log(redirectLocation);
        return;
    }
    if (renderProps) {
        const component = <common.RoutingContext {...renderProps} />;
        console.log(renderToString(component));
    }
});
