let Router = window.ReactRouter.Router;
let Route = window.ReactRouter.Router;
let Link = window.ReactRouter.Link;
let React = window.React;
let ReactDOM = window.ReactDOM;

import {SuccessComponent} from "./success";
import {ErrorComponent} from "./error";

ReactDOM.render(
    <Router>
        <Route path="/success" component={SuccessComponent}/>
        <Route path="/error" component={ErrorComponent}/>
    </Router>,
    document.getElementById("container")
);
