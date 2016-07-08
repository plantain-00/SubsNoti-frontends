import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

type State = {
    applications?: types.Application[];
    idInEditing?: string;
    nameInEditing?: string;
    homeUrlInEditing?: string;
    descriptionInEditing?: string;
    authorizationCallbackUrlInEditing?: string;
    clientSecretInEditing?: string;
};

type Self = types.Self<State> & {
    edit: (application: types.Application) => void;
    get: () => void;
    new: () => void;
    save: () => void;
    remove: () => void;
    resetClientSecret: () => void;

    nameInEditingChanged: (e: common.Event) => void;
    homeUrlInEditingChanged: (e: common.Event) => void;
    descriptionInEditingChanged: (e: common.Event) => void;
    authorizationCallbackUrlInEditingChanged: (e: common.Event) => void;
};

const spec: Self = {
    edit: function(this: Self, application: types.Application) {
        this.setState!({
            idInEditing: application.id,
            nameInEditing: application.name,
            homeUrlInEditing: application.homeUrl,
            descriptionInEditing: application.description,
            authorizationCallbackUrlInEditing: application.authorizationCallbackUrl,
            clientSecretInEditing: application.clientSecret,
        });
    },
    get: function(this: Self) {
        $.ajax({
            url: apiBaseUrl + "/api/user/registered",
            cache: false,
        }).then((data: types.ApplicationsResponse) => {
            if (data.status === 0) {
                this.setState!({ applications: data.applications });
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    new: function(this: Self) {
        this.setState!({
            idInEditing: undefined,
            nameInEditing: "",
            homeUrlInEditing: "",
            descriptionInEditing: "",
            authorizationCallbackUrlInEditing: "",
            clientSecretInEditing: "",
        });
    },
    save: function(this: Self) {
        if (this.state!.idInEditing) {
            $.ajax({
                url: apiBaseUrl + `/api/user/registered/${this.state!.idInEditing}`,
                method: "PUT",
                data: {
                    name: this.state!.nameInEditing,
                    homeUrl: this.state!.homeUrlInEditing,
                    description: this.state!.descriptionInEditing,
                    authorizationCallbackUrl: this.state!.authorizationCallbackUrlInEditing,
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
                url: apiBaseUrl + "/api/user/registered",
                method: "POST",
                data: {
                    name: this.state!.nameInEditing,
                    homeUrl: this.state!.homeUrlInEditing,
                    description: this.state!.descriptionInEditing,
                    authorizationCallbackUrl: this.state!.authorizationCallbackUrlInEditing,
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
        }
    },
    remove: function(this: Self) {
        $.ajax({
            url: apiBaseUrl + `/api/user/registered/${this.state!.idInEditing}`,
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
    resetClientSecret: function(this: Self) {
        $.ajax({
            url: apiBaseUrl + `/api/user/registered/${this.state!.idInEditing}/client_secret`,
            method: "PUT",
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
    nameInEditingChanged: function(this: Self, e: common.Event) {
        this.setState!({ nameInEditing: e.target.value });
    },
    homeUrlInEditingChanged: function(this: Self, e: common.Event) {
        this.setState!({ homeUrlInEditing: e.target.value });
    },
    descriptionInEditingChanged: function(this: Self, e: common.Event) {
        this.setState!({ descriptionInEditing: e.target.value });
    },
    authorizationCallbackUrlInEditingChanged: function(this: Self, e: common.Event) {
        this.setState!({ authorizationCallbackUrlInEditing: e.target.value });
    },
    componentDidMount: function(this: Self) {
        this.get();
    },
    getInitialState: function() {
        return {
            applications: [],
            idInEditing: undefined,
            nameInEditing: "",
            homeUrlInEditing: "",
            descriptionInEditing: "",
            authorizationCallbackUrlInEditing: "",
            clientSecretInEditing: "",
        } as State;
    },
    render: function(this: Self) {
        const applicationsView = this.state!.applications!.map(application => {
            return (
                <tr key={application.id}>
                    <td>
                        <a href="javascript:void(0)" onClick={this.edit.bind(this, application)}>{application.name}</a>
                        <p>
                            client id: {application.clientId}
                        </p>
                    </td>
                </tr>
            );
        });

        const nameView = (
            <div className="form-group">
                <label htmlFor="name">name</label>
                <input type="text" className="form-control" id="name" placeholder="name" onChange={this.nameInEditingChanged} value={this.state!.nameInEditing}/>
            </div>
        );
        const homeUrlView = (
            <div className="form-group">
                <label htmlFor="home-url">home url</label>
                <input type="text" className="form-control" id="home-url" placeholder="https://" onChange={this.homeUrlInEditingChanged} value={this.state!.homeUrlInEditing}/>
            </div>
        );
        const descriptionView = (
            <div className="form-group">
                <label htmlFor="description">description</label>
                <input type="text" className="form-control" id="description" placeholder="optional" onChange={this.descriptionInEditingChanged} value={this.state!.descriptionInEditing}/>
            </div>
        );
        const authorizationCallbackUrl = (
            <div className="form-group">
                <label htmlFor="authorizationCallbackUrl">authorization callback url</label>
                <input type="text" className="form-control" id="authorizationCallbackUrl" placeholder="https://" onChange={this.authorizationCallbackUrlInEditingChanged} value={this.state!.authorizationCallbackUrlInEditing}/>
            </div>
        );

        let applicationView: JSX.Element | undefined = undefined;
        if (this.state!.idInEditing) {
            applicationView = (
                <form className="form">
                    <button type="button" className="btn btn-default" onClick={this.new}>New</button>
                    <div className="form-group">
                        <label>client secret</label>
                        <input type="text" className="form-control" readOnly value={this.state!.clientSecretInEditing}/>
                    </div>
                    <button type="button" className="btn btn-danger" onClick={this.resetClientSecret}>Reset client secret</button>
                    {nameView}
                    {homeUrlView}
                    {descriptionView}
                    {authorizationCallbackUrl}
                    <button type="button" className="btn btn-primary" onClick={this.save}>Update</button>
                    <button type="button" className="btn btn-danger" onClick={this.remove}>Delete</button>
                </form>
            );
        } else {
            applicationView = (
                <form className="form">
                    {nameView}
                    {homeUrlView}
                    {descriptionView}
                    {authorizationCallbackUrl}
                    <button type="button" className="btn btn-primary" onClick={this.save}>Register</button>
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
                                Registered applications
                            </div>
                            <div className="panel-body">
                                <form className="form">
                                    <div className="form-group">
                                        <div className="col-sm-12">
                                            <table className="table">
                                                <tbody>
                                                    {applicationsView}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </form>
                                {applicationView}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

export const RegisteredComponent = React.createClass(spec);
