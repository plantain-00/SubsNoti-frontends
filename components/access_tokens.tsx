import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

interface State {
    accessTokens?: types.AccessToken[];
    idInEditing?: string;
    descriptionInEditing?: string;
    scopes?: types.Scope[];
    scopesInEditing?: string[];
    newAccessToken?: string;
}

interface Self extends types.Self<State> {
    edit: (accessToken: types.AccessToken) => void;
    get: () => void;
    new: () => void;
    save: () => void;
    remove: () => void;
    regenerate: () => void;

    descriptionInEditingChanged: (e) => void;
    scopesInEditingChanged: (e) => void;
}

const spec: Self = {
    edit: function(accessToken: types.AccessToken) {
        const self: Self = this;

        self.setState({
            idInEditing: accessToken.id,
            descriptionInEditing: accessToken.description,
            scopesInEditing: accessToken.scopes.map(a => a.name),
            newAccessToken: "",
        });
    },
    get: function() {
        const self: Self = this;

        $.ajax({
            url: apiBaseUrl + "/api/user/access_tokens",
            cache: false,
        }).then((data: types.AccessTokensResponse) => {
            if (data.isSuccess) {
                for (const token of data.accessTokens) {
                    token.lastUsed = token.lastUsed ? moment(token.lastUsed, moment.ISO_8601).fromNow() : "never used";
                }
                self.setState({ accessTokens: data.accessTokens });
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    new: function() {
        const self: Self = this;

        self.setState({
            idInEditing: null,
            descriptionInEditing: "",
            scopesInEditing: [],
            newAccessToken: "",
        });
    },
    save: function() {
        const self: Self = this;

        if (self.state.idInEditing) {
            $.ajax({
                url: apiBaseUrl + `/api/user/access_tokens/${self.state.idInEditing}`,
                method: "PUT",
                data: {
                    description: self.state.descriptionInEditing,
                    scopes: self.state.scopesInEditing,
                },
            }).then((data: types.Response) => {
                if (data.isSuccess) {
                    global.head.showAlert(true, "success");
                    self.new();
                    self.get();
                } else {
                    global.head.showAlert(false, data.errorMessage);
                }
            });
        } else {
            $.ajax({
                url: apiBaseUrl + "/api/user/access_tokens",
                method: "POST",
                data: {
                    description: self.state.descriptionInEditing,
                    scopes: self.state.scopesInEditing,
                },
            }).then((data: types.AccessTokenResponse) => {
                if (data.isSuccess) {
                    global.head.showAlert(true, "success");
                    self.new();
                    self.get();
                    self.setState({ newAccessToken: data.accessToken });
                } else {
                    global.head.showAlert(false, data.errorMessage);
                }
            });
        }
    },
    remove: function() {
        const self: Self = this;

        $.ajax({
            url: apiBaseUrl + `/api/user/access_tokens/${self.state.idInEditing}`,
            method: "DELETE",
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success");
                self.new();
                self.get();
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    regenerate: function() {
        const self: Self = this;

        $.ajax({
            url: apiBaseUrl + `/api/user/access_tokens/${self.state.idInEditing}/value`,
            method: "PUT",
        }).then((data: types.AccessTokenResponse) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success");
                self.new();
                self.get();
                self.setState({ newAccessToken: data.accessToken });
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    descriptionInEditingChanged: function(e) {
        const self: Self = this;

        self.setState({ descriptionInEditing: e.target.value });
    },
    scopesInEditingChanged: function(e) {
        const self: Self = this;

        const value = e.target.value;
        const index = self.state.scopesInEditing.indexOf(value);
        if (index >= 0) {
            self.setState({ scopesInEditing: self.state.scopesInEditing.splice(index, 1) });
        } else {
            self.setState({ scopesInEditing: self.state.scopesInEditing.concat([value]) });
        }
    },
    componentDidMount: function() {
        const self: Self = this;

        self.get();

        $.ajax({
            url: apiBaseUrl + "/api/scopes",
        }).then((data: types.ScopesResponse) => {
            if (data.isSuccess) {
                self.setState({ scopes: data.scopes });
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    getInitialState: function() {
        return {
            accessTokens: [],
            idInEditing: null,
            descriptionInEditing: "",
            scopes: [],
            scopesInEditing: [],
            newAccessToken: "",
        } as State;
    },
    render: function() {
        const self: Self = this;

        const accessTokensView = self.state.accessTokens.map(accessToken => {
            const scopesView = accessToken.scopes.map(scope => {
                return (
                    <span key={scope.name} className="label label-success access-token-scope">
                        {scope.name}
                    </span>
                );
            });
            return (
                <tr key={accessToken.id}>
                    <td>
                        <a href="javascript:void(0)" onClick={self.edit.bind(this, accessToken) }>
                            {accessToken.description}
                            (last used: {accessToken.lastUsed})
                        </a>
                        <p>
                            last used: {accessToken.lastUsed}
                            •
                            {scopesView}
                        </p>
                    </td>
                </tr>
            );
        });

        const scopesView = self.state.scopes.map(scope => {
            const checked = self.state.scopesInEditing.indexOf(scope.name) >= 0;
            return (
                <label key={scope.name} className="checkbox">
                    <input type="checkbox" onChange={self.scopesInEditingChanged} value={scope.name} checked={checked} />
                    {scope.name} : {scope.description}
                </label>
            );
        });

        let newAccessTokenView;
        if (self.state.newAccessToken) {
            newAccessTokenView = (
                <div className="form-group">
                    <label>new access token</label>
                    <input type="text" className="form-control" value={self.state.newAccessToken} readOnly />
                </div>
            );
        }

        const descriptionView = (
            <div className="form-group">
                <label htmlFor="description">description</label>
                <input type="text" className="form-control" id="description" onChange={self.descriptionInEditingChanged} value={self.state.descriptionInEditing} />
            </div>
        );

        let accessTokenView;
        if (self.state.idInEditing) {
            accessTokenView = (
                <form className="form">
                    <button type="button" className="btn btn-default" onClick={self.new}>
                        New
                    </button>
                    <button type="button" className="btn btn-danger" onClick={self.regenerate}>
                        Regenerate access token
                    </button>
                    {newAccessTokenView}
                    {descriptionView}
                    <div className="checkbox">
                        {scopesView}
                    </div>
                    <button type="button" className="btn btn-primary" onClick={self.save}>Update</button>
                    <button type="button" className="btn btn-danger" onClick={self.remove}>Delete</button>
                </form>
            );
        } else {
            accessTokenView = (
                <form className="form">
                    {newAccessTokenView}
                    {descriptionView}
                    <div className="checkbox">
                        {scopesView}
                    </div>
                    <button type="button" className="btn btn-primary" onClick={self.save}>Create</button>
                </form>
            );
        }

        return (
            <div>
                <HeadComponent/>
                <div className="container body-container">
                    <div className="row">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                Access tokens
                            </div>
                            <div className="panel-body">
                                <form className="form">
                                    <div className="form-group">
                                        <div className="col-sm-12">
                                            <table className="table">
                                                <tbody>
                                                    {accessTokensView}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </form>
                                {accessTokenView}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

export const AccessTokensComponent = React.createClass(spec);
