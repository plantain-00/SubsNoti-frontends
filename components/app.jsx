let Router = window.ReactRouter.Router;
let Route = window.ReactRouter.Router;
let Link = window.ReactRouter.Link;
let React = window.React;
let ReactDOM = window.ReactDOM;

import {SuccessComponent} from "./success";

ReactDOM.render(
    <Router>
        <Route path="/success" component={SuccessComponent}/>
    </Router>,
    document.getElementById("container")
);
