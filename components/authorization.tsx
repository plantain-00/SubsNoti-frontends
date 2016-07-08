import * as types from "../share/types";
import { HeadComponent, global } from "./head";
import * as common from "./common";
import * as React from "react";

type State = {
    allScopes?: types.Scope[];
    scopes?: string[];
    redirectUrl?: string;
    code?: string;
    application?: types.Application;
};

type Self = types.Self<State> & {
    confirm: () => void;
};

const spec: Self = {
    confirm: function (this: Self) {
        $.ajax({
            url: apiBaseUrl + `/api/user/access_tokens/${this.state!.code}`,
            method: "POST",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                alert("success");
                location.href = this.state!.redirectUrl!;
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    componentDidMount: function (this: Self) {
        const scopes = decodeURIComponent(common.getUrlParameter("scopes") !);
        this.setState!({
            redirectUrl: decodeURIComponent(common.getUrlParameter("redirect_url") !),
            scopes: scopes.split(","),
            code: decodeURIComponent(common.getUrlParameter("code") !),
        });

        const applicationId = common.getUrlParameter("application_id");
        if (applicationId) {
            $.ajax({
                url: apiBaseUrl + `/api/applications/${decodeURIComponent(applicationId)}`,
            }).then((data: types.ApplicationResponse) => {
                if (data.status === 0) {
                    this.setState!({ application: data.application });
                } else {
                    global.head!.showAlert(false, data.errorMessage!);
                }
            });
        }

        $.ajax({
            url: apiBaseUrl + "/api/scopes",
        }).then((data: types.ScopesResponse) => {
            if (data.status === 0) {
                this.setState!({ allScopes: data.scopes });
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    getInitialState: function () {
        return {
            allScopes: [],
            scopes: [],
            redirectUrl: "",
            code: "",
            application: undefined,
        } as State;
    },
    render: function (this: Self) {
        let applicationView: JSX.Element | undefined = undefined;
        if (this.state!.application) {
            applicationView = (
                <div className="panel-heading">
                    Authorization to {this.state!.application!.name} (owned by {this.state!.application!.creator!.name})
                </div>
            );
        }

        const scopesView = this.state!.allScopes!.map(scope => {
            const checked = this.state!.scopes!.indexOf(scope.name) >= 0;
            return (
                <label key={scope.name} className="checkbox">
                    <input type="checkbox" checked={checked} value={scope.name} readOnly/>
                    {scope.name}: {scope.description}
                </label>
            );
        });

        let codeView: JSX.Element | undefined = undefined;
        if (this.state!.code) {
            codeView = (
                <form className="form">
                    <div className="checkbox">
                        {scopesView}
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.confirm}>Confirm</button>
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
