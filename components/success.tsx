import * as types from "../share/types";
import * as common from "./common";
import * as React from "react";

type State = {
    redirectUrl?: string;
};

type Self = types.Self<State>;

const spec: Self = {
    getInitialState: function() {
        const willClearPreviousStatus = common.getUrlParameter("clear_previous_status");

        if (willClearPreviousStatus === types.yes) {
            window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
        }

        const redirectUrl = common.getUrlParameter("redirect_url");

        return {
            redirectUrl: redirectUrl ? decodeURIComponent(redirectUrl) : "",
        } as State;
    },
    render: function(this: Self) {
        let redirectUrlView: JSX.Element | undefined = undefined;
        if (this.state!.redirectUrl) {
            redirectUrlView = (
                <span>
                    or <a href={this.state!.redirectUrl} className="alert-link">Continue</a>
                </span>
            );
        }
        return (
            <div className="container body-container">
                <div className="row">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="alert alert-success" role="alert">
                                success! go to <common.Link to="/" className="alert-link">Home page</common.Link> now.
                                {redirectUrlView}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

export const SuccessComponent = React.createClass(spec);
