/// <reference path="./common.d.ts" />

let Router = ReactRouter.Router;
let Route = ReactRouter.Route;
let Link = ReactRouter.Link;

import {SuccessComponent} from "./success";
import {ErrorComponent} from "./error";
import {NewOrganizationComponent} from "./new_organization";

ReactDOM.render(
    <Router>
        <Route path="/success" component={SuccessComponent}/>
        <Route path="/error" component={ErrorComponent}/>
        <Route path="/new_organization" component={NewOrganizationComponent}/>
    </Router>,
    document.getElementById("container")
);
