/// <reference path="./common.d.ts" />

let Router = ReactRouter.Router;
let Route = ReactRouter.Route;

let createHistory: () => any = (window as any).History.createHistory;

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

ReactDOM.render(
    <Router>
        <Route path="/success" component={SuccessComponent}/>
        <Route path="/error" component={ErrorComponent}/>
        <Route path="/new_organization" component={NewOrganizationComponent}/>
        <Route path="/invite" component={InviteComponent}/>
        <Route path="/access_tokens" component={AccessTokensComponent}/>
        <Route path="/authorized" component={AuthorizedComponent}/>
        <Route path="/registered" component={RegisteredComponent}/>
        <Route path="/authorization" component={AuthorizationComponent}/>
        <Route path="/login" component={LoginComponent}/>
        <Route path="/user" component={UserComponent}/>
    </Router>,
    document.getElementById("container")
);
