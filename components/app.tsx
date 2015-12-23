/// <reference path="./common.d.ts" />

let Router = ReactRouter.Router;
let Route = ReactRouter.Route;

let createHistory: () => any = (window as any).History.createHistory;

import {SuccessComponent} from "./success";
import {ErrorComponent} from "./error";
import {NewOrganizationComponent} from "./new_organization";
import {InviteComponent} from "./invite";

ReactDOM.render(
    <Router>
        <Route path="/success" component={SuccessComponent}/>
        <Route path="/error" component={ErrorComponent}/>
        <Route path="/new_organization" component={NewOrganizationComponent}/>
        <Route path="/invite" component={InviteComponent}/>
    </Router>,
    document.getElementById("container")
);
