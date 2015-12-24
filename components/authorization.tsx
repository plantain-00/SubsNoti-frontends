import * as types from "./types";
import {HeadComponent, events} from "./head";
import * as common from "./common";

let Link = ReactRouter.Link;

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

export let AuthorizationComponent = React.createClass({
    confirm: function() {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + `/api/user/access_tokens/${self.state.code}`,
            method: "POST",
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                alert("success");
                location.href = self.state.redirectUrl;
            } else {
                events.showAlert(false, data.errorMessage);
            }
        });
    },
    componentWillMount: function() {
        let self: Self = this;

        events.authenticated = error => {
            let scopes = decodeURIComponent(common.getUrlParameter("scopes"));
            self.setState({
                redirectUrl: decodeURIComponent(common.getUrlParameter("redirect_url")),
                scopes: scopes.split(","),
                code: decodeURIComponent(common.getUrlParameter("code")),
            });

            let applicationId = common.getUrlParameter("application_id");
            if (applicationId) {
                $.ajax({
                    url: apiBaseUrl + `/api/applications/${decodeURIComponent(applicationId)}`
                }).then((data: types.ApplicationResponse) => {
                    if (data.isSuccess) {
                        self.setState({ application: data.application });
                    } else {
                        events.showAlert(false, data.errorMessage);
                    }
                });
            }

            $.ajax({
                url: apiBaseUrl + "/api/scopes"
            }).then((data: types.ScopesResponse) => {
                if (data.isSuccess) {
                    self.setState({ allScopes: data.scopes });
                } else {
                    events.showAlert(false, data.errorMessage);
                }
            });
        };
    },
    componentWillUnmount: function() {
        events.authenticated = undefined;
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
        let self: Self = this;

        let applicationView;
        if (self.state.application) {
            applicationView = (
                <div className="panel-heading">
                    Authorization to {self.state.application.name} (owned by {self.state.application.creator.name})
                </div>
            );
        }

        let scopesView = self.state.allScopes.map(scope => {
            let checked = self.state.scopes.indexOf(scope.name) >= 0;
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
                <div className="container" style={{ marginTop: 60 + "px" }}>
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
});
