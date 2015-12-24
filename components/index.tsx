/// <reference path="./common.d.ts" />

let Router = ReactRouter.Router;
let Route = ReactRouter.Route;

let createHistory: () => any = (window as any).History.createHistory;
let history = createHistory();

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

ReactDOM.render(
    <Router history={history}>
        <Route path="/" component={ThemesComponent}/>
        <Route path="/themes.html" component={ThemesComponent}/>
        <Route path="/success.html" component={SuccessComponent}/>
        <Route path="/error.html" component={ErrorComponent}/>
        <Route path="/new_organization.html" component={NewOrganizationComponent}/>
        <Route path="/invite.html" component={InviteComponent}/>
        <Route path="/access_tokens" component={AccessTokensComponent}/>
        <Route path="/authorized.html" component={AuthorizedComponent}/>
        <Route path="/registered.html" component={RegisteredComponent}/>
        <Route path="/authorization.html" component={AuthorizationComponent}/>
        <Route path="/login.html" component={LoginComponent}/>
        <Route path="/user.html" component={UserComponent}/>
    </Router>,
    document.getElementById("container")
);
