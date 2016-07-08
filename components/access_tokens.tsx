import * as types from "../share/types";
import { HeadComponent, global } from "./head";
import * as common from "./common";
import * as React from "react";

type State = {
    accessTokens?: types.AccessToken[];
    idInEditing?: string;
    descriptionInEditing?: string;
    scopes?: types.Scope[];
    scopesInEditing?: string[];
    newAccessToken?: string;
};

type Self = types.Self<State> & {
    edit: (accessToken: types.AccessToken) => void;
    get: () => void;
    new: () => void;
    save: () => void;
    remove: () => void;
    regenerate: () => void;

    descriptionInEditingChanged: (e: common.Event) => void;
    scopesInEditingChanged: (e: common.Event) => void;
};

const spec: Self = {
    edit: function (this: Self, accessToken: types.AccessToken) {
        this.setState!({
            idInEditing: accessToken.id,
            descriptionInEditing: accessToken.description,
            scopesInEditing: accessToken.scopes!.map(a => a.name),
            newAccessToken: "",
        });
    },
    get: function (this: Self) {
        $.ajax({
            url: apiBaseUrl + "/api/user/access_tokens",
            cache: false,
        }).then((data: types.AccessTokensResponse) => {
            if (data.status === 0) {
                for (const token of data.accessTokens) {
                    token.lastUsed = token.lastUsed ? moment(token.lastUsed, moment.ISO_8601).fromNow() : "never used";
                }
                this.setState!({ accessTokens: data.accessTokens });
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    new: function (this: Self) {
        this.setState!({
            idInEditing: undefined,
            descriptionInEditing: "",
            scopesInEditing: [],
            newAccessToken: "",
        });
    },
    save: function (this: Self) {
        if (this.state!.idInEditing) {
            $.ajax({
                url: apiBaseUrl + `/api/user/access_tokens/${this.state!.idInEditing}`,
                method: "PUT",
                data: {
                    description: this.state!.descriptionInEditing,
                    scopes: this.state!.scopesInEditing,
                },
            }).then((data: types.Response) => {
                if (data.status === 0) {
                    global.head!.showAlert(true, "success");
                    this.new();
                    this.get();
                } else {
                    global.head!.showAlert(false, data.errorMessage!);
                }
            });
        } else {
            $.ajax({
                url: apiBaseUrl + "/api/user/access_tokens",
                method: "POST",
                data: {
                    description: this.state!.descriptionInEditing,
                    scopes: this.state!.scopesInEditing,
                },
            }).then((data: types.AccessTokenResponse) => {
                if (data.status === 0) {
                    global.head!.showAlert(true, "success");
                    this.new();
                    this.get();
                    this.setState!({ newAccessToken: data.accessToken });
                } else {
                    global.head!.showAlert(false, data.errorMessage!);
                }
            });
        }
    },
    remove: function (this: Self) {
        $.ajax({
            url: apiBaseUrl + `/api/user/access_tokens/${this.state!.idInEditing}`,
            method: "DELETE",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
                this.new();
                this.get();
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    regenerate: function (this: Self) {
        $.ajax({
            url: apiBaseUrl + `/api/user/access_tokens/${this.state!.idInEditing}/value`,
            method: "PUT",
        }).then((data: types.AccessTokenResponse) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
                this.new();
                this.get();
                this.setState!({ newAccessToken: data.accessToken });
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    descriptionInEditingChanged: function (this: Self, e: common.Event) {
        this.setState!({ descriptionInEditing: e.target.value });
    },
    scopesInEditingChanged: function (this: Self, e: common.Event) {
        const value = e.target.value;
        const index = this.state!.scopesInEditing!.indexOf(value);
        if (index >= 0) {
            this.setState!({ scopesInEditing: this.state!.scopesInEditing!.splice(index, 1) });
        } else {
            this.setState!({ scopesInEditing: this.state!.scopesInEditing!.concat([value]) });
        }
    },
    componentDidMount: function (this: Self) {
        this.get();

        $.ajax({
            url: apiBaseUrl + "/api/scopes",
        }).then((data: types.ScopesResponse) => {
            if (data.status === 0) {
                this.setState!({ scopes: data.scopes });
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    getInitialState: function () {
        return {
            accessTokens: [],
            idInEditing: undefined,
            descriptionInEditing: "",
            scopes: [],
            scopesInEditing: [],
            newAccessToken: "",
        } as State;
    },
    render: function (this: Self) {
        const accessTokensView = this.state!.accessTokens!.map(accessToken => {
            const scopesView = accessToken.scopes!.map(scope => {
                return (
                    <span key={scope.name} className="label label-success access-token-scope">
                        {scope.name}
                    </span>
                );
            });
            return (
                <tr key={accessToken.id}>
                    <td>
                        <a href="javascript:void(0)" onClick={this.edit.bind(this, accessToken)}>
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

        const scopesView = this.state!.scopes!.map(scope => {
            const checked = this.state!.scopesInEditing!.indexOf(scope.name) >= 0;
            return (
                <label key={scope.name} className="checkbox">
                    <input type="checkbox" onChange={this.scopesInEditingChanged} value={scope.name} checked={checked} />
                    {scope.name} : {scope.description}
                </label>
            );
        });

        let newAccessTokenView: JSX.Element | undefined = undefined;
        if (this.state!.newAccessToken) {
            newAccessTokenView = (
                <div className="form-group">
                    <label>new access token</label>
                    <input type="text" className="form-control" value={this.state!.newAccessToken} readOnly />
                </div>
            );
        }

        const descriptionView = (
            <div className="form-group">
                <label htmlFor="description">description</label>
                <input type="text" className="form-control" id="description" onChange={this.descriptionInEditingChanged} value={this.state!.descriptionInEditing} />
            </div>
        );

        let accessTokenView: JSX.Element;
        if (this.state!.idInEditing) {
            accessTokenView = (
                <form className="form">
                    <button type="button" className="btn btn-default" onClick={this.new}>
                        New
                    </button>
                    <button type="button" className="btn btn-danger" onClick={this.regenerate}>
                        Regenerate access token
                    </button>
                    {newAccessTokenView}
                    {descriptionView}
                    <div className="checkbox">
                        {scopesView}
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.save}>Update</button>
                    <button type="button" className="btn btn-danger" onClick={this.remove}>Delete</button>
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
                    <button type="button" className="btn btn-primary" onClick={this.save}>Create</button>
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
