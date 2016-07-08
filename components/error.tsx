import * as types from "../share/types";
import * as common from "./common";
import * as React from "react";

type State = {
    message?: string;
};

type Self = types.Self<State>;

const spec: Self = {
    getInitialState: function () {
        return {
            message: decodeURIComponent(common.getUrlParameter("message") !),
        } as State;
    },
    render: function (this: Self) {
        return (
            <div className="container body-container">
                <div className="row">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="alert alert-danger" role="alert">
                                <span>{this.state!.message}</span>
                                go to <common.Link to="/" className="alert-link">Home page</common.Link> now.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

export const ErrorComponent = React.createClass(spec);
