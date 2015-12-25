import * as types from "./types";
import {HeadComponent, global} from "./head";
import * as common from "./common";

interface State {
    applications?: types.Application[];
    idInEditing?: string;
    nameInEditing?: string;
    homeUrlInEditing?: string;
    descriptionInEditing?: string;
    authorizationCallbackUrlInEditing?: string;
    clientSecretInEditing?: string;
}

interface Self extends types.Self<State> {
    edit: (application: types.Application) => void;
    get: () => void;
    new: () => void;
    save: () => void;
    remove: () => void;
    resetClientSecret: () => void;

    nameInEditingChanged: (e) => void;
    homeUrlInEditingChanged: (e) => void;
    descriptionInEditingChanged: (e) => void;
    authorizationCallbackUrlInEditingChanged: (e) => void;
}

export let RegisteredComponent = React.createClass({
    edit: function(application: types.Application) {
        let self: Self = this;

        self.setState({
            idInEditing: application.id,
            nameInEditing: application.name,
            homeUrlInEditing: application.homeUrl,
            descriptionInEditing: application.description,
            authorizationCallbackUrlInEditing: application.authorizationCallbackUrl,
            clientSecretInEditing: application.clientSecret,
        });
    },
    get: function() {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + "/api/user/registered",
            cache: false,
        }).then((data: types.ApplicationsResponse) => {
            if (data.isSuccess) {
                self.setState({ applications: data.applications });
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    new: function() {
        let self: Self = this;

        self.setState({
            idInEditing: null,
            nameInEditing: "",
            homeUrlInEditing: "",
            descriptionInEditing: "",
            authorizationCallbackUrlInEditing: "",
            clientSecretInEditing: "",
        });
    },
    save: function() {
        let self: Self = this;

        if (self.state.idInEditing) {
            $.ajax({
                url: apiBaseUrl + `/api/user/registered/${self.state.idInEditing}`,
                method: "PUT",
                data: {
                    name: self.state.nameInEditing,
                    homeUrl: self.state.homeUrlInEditing,
                    description: self.state.descriptionInEditing,
                    authorizationCallbackUrl: self.state.authorizationCallbackUrlInEditing,
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
                url: apiBaseUrl + "/api/user/registered",
                method: "POST",
                data: {
                    name: self.state.nameInEditing,
                    homeUrl: self.state.homeUrlInEditing,
                    description: self.state.descriptionInEditing,
                    authorizationCallbackUrl: self.state.authorizationCallbackUrlInEditing,
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
        }
    },
    remove: function() {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + `/api/user/registered/${self.state.idInEditing}`,
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
    resetClientSecret: function() {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + `/api/user/registered/${self.state.idInEditing}/client_secret`,
            method: "PUT",
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
    nameInEditingChanged: function(e) {
        let self: Self = this;

        self.setState({ nameInEditing: e.target.value });
    },
    homeUrlInEditingChanged: function(e) {
        let self: Self = this;

        self.setState({ homeUrlInEditing: e.target.value });
    },
    descriptionInEditingChanged: function(e) {
        let self: Self = this;

        self.setState({ descriptionInEditing: e.target.value });
    },
    authorizationCallbackUrlInEditingChanged: function(e) {
        let self: Self = this;

        self.setState({ authorizationCallbackUrlInEditing: e.target.value });
    },
    componentWillMount: function() {
        let self: Self = this;

        global.authenticated = error => {
            self.get();
        };
    },
    componentWillUnmount: function() {
        global.authenticated = undefined;
    },
    getInitialState: function() {
        return {
            applications: [],
            idInEditing: null,
            nameInEditing: "",
            homeUrlInEditing: "",
            descriptionInEditing: "",
            authorizationCallbackUrlInEditing: "",
            clientSecretInEditing: "",
        } as State;
    },
    render: function() {
        let self: Self = this;

        let applicationsView = self.state.applications.map(application => {
            return (
                <tr key={application.id}>
                    <td>
                        <a href="javascript:void(0)" onClick={self.edit.bind(this, application)}>{application.name}</a>
                        <p>
                            client id: {application.clientId}
                        </p>
                    </td>
                </tr>
            );
        });

        let nameView = (
            <div className="form-group">
                <label htmlFor="name">name</label>
                <input type="text" className="form-control" id="name" placeholder="name" onChange={self.nameInEditingChanged} value={self.state.nameInEditing}/>
            </div>
        );
        let homeUrlView = (
            <div className="form-group">
                <label htmlFor="home-url">home url</label>
                <input type="text" className="form-control" id="home-url" placeholder="https://" onChange={self.homeUrlInEditingChanged} value={self.state.homeUrlInEditing}/>
            </div>
        );
        let descriptionView = (
            <div className="form-group">
                <label htmlFor="description">description</label>
                <input type="text" className="form-control" id="description" placeholder="optional" onChange={self.descriptionInEditingChanged} value={self.state.descriptionInEditing}/>
            </div>
        );
        let authorizationCallbackUrl = (
            <div className="form-group">
                <label htmlFor="authorizationCallbackUrl">authorization callback url</label>
                <input type="text" className="form-control" id="authorizationCallbackUrl" placeholder="https://" onChange={self.authorizationCallbackUrlInEditingChanged} value={self.state.authorizationCallbackUrlInEditing}/>
            </div>
        );

        let applicationView;
        if (self.state.idInEditing) {
            applicationView = (
                <form className="form">
                    <button type="button" className="btn btn-default" onClick={self.new}>New</button>
                    <div className="form-group">
                        <label>client secret</label>
                        <input type="text" className="form-control" readOnly value={self.state.clientSecretInEditing}/>
                    </div>
                    <button type="button" className="btn btn-danger" onClick={self.resetClientSecret}>Reset client secret</button>
                    {nameView}
                    {homeUrlView}
                    {descriptionView}
                    {authorizationCallbackUrl}
                    <button type="button" className="btn btn-primary" onClick={self.save}>Update</button>
                    <button type="button" className="btn btn-danger" onClick={self.remove}>Delete</button>
                </form>
            );
        } else {
            applicationView = (
                <form className="form">
                    {nameView}
                    {homeUrlView}
                    {descriptionView}
                    {authorizationCallbackUrl}
                    <button type="button" className="btn btn-primary" onClick={self.save}>Register</button>
                </form>
            );
        }

        return (
            <div>
                <HeadComponent/>
                <div className="container" style={{ marginTop: 60 + "px" }}>
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
});
