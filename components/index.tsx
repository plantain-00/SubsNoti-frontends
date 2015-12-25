/// <reference path="./common.d.ts" />

import * as common from "./common";

let history = common.History.createHistory();

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
