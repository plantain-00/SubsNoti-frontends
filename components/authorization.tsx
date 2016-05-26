import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

interface State {
    allScopes?: types.Scope[];
    scopes?: string[];
    redirectUrl?: string;
    code?: string;
    application?: types.Application;
}

interface Self extends types.Self<State> {
    confirm: () => void;
}

const spec: Self = {
    confirm: function() {
        const self: Self = this;

        $.ajax({
            url: apiBaseUrl + `/api/user/access_tokens/${self.state.code}`,
            method: "POST",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                alert("success");
                location.href = self.state.redirectUrl;
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    componentDidMount: function() {
        const self: Self = this;

        const scopes = decodeURIComponent(common.getUrlParameter("scopes"));
        self.setState({
            redirectUrl: decodeURIComponent(common.getUrlParameter("redirect_url")),
            scopes: scopes.split(","),
            code: decodeURIComponent(common.getUrlParameter("code")),
        });

        const applicationId = common.getUrlParameter("application_id");
        if (applicationId) {
            $.ajax({
                url: apiBaseUrl + `/api/applications/${decodeURIComponent(applicationId)}`,
            }).then((data: types.ApplicationResponse) => {
                if (data.status === 0) {
                    self.setState({ application: data.application });
                } else {
                    global.head.showAlert(false, data.errorMessage);
                }
            });
        }

        $.ajax({
            url: apiBaseUrl + "/api/scopes",
        }).then((data: types.ScopesResponse) => {
            if (data.status === 0) {
                self.setState({ allScopes: data.scopes });
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    getInitialState: function() {
        return {
            allScopes: [],
            scopes: [],
            redirectUrl: "",
            code: "",
            application: null,
        } as State;
    },
    render: function() {
        const self: Self = this;

        let applicationView;
        if (self.state.application) {
            applicationView = (
                <div className="panel-heading">
                    Authorization to {self.state.application.name} (owned by {self.state.application.creator.name})
                </div>
            );
        }

        const scopesView = self.state.allScopes.map(scope => {
            const checked = self.state.scopes.indexOf(scope.name) >= 0;
            return (
                <label key={scope.name} className="checkbox">
                    <input type="checkbox" checked={checked} value={scope.name} readOnly/>
                    {scope.name} : {scope.description}
                </label>
            );
        });

        let codeView;
        if (self.state.code) {
            codeView = (
                <form className="form">
                    <div className="checkbox">
                        {scopesView}
                    </div>
                    <button type="button" className="btn btn-primary" onClick={self.confirm}>Confirm</button>
                </form>
            );
        }

        return (
            <div>
                <HeadComponent/>
                <div className="container body-container">
                    <div className="row">
                        <div className="panel panel-default">
                            {applicationView}
                            <div className="panel-body">
                                {codeView}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

export const AuthorizationComponent = React.createClass(spec);
