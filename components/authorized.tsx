import * as types from "./types";
import {HeadComponent, global} from "./head";
import * as common from "./common";

interface State {
    applications?: types.Application[];
    application?: types.Application;
}

interface Self extends types.Self<State> {
    show: (application: types.Application) => void;
    get: () => void;
    revoke: (application: types.Application) => void;
}

export let AuthorizedComponent = React.createClass({
    show: function(application: types.Application) {
        let self: Self = this;

        self.state.application = application;
    },
    get: function() {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + "/api/user/authorized",
            cache: false,
        }).then((data: types.ApplicationsResponse) => {
            if (data.isSuccess) {
                for (let application of data.applications) {
                    application.lastUsed = application.lastUsed ? moment(application.lastUsed, moment.ISO_8601).fromNow() : "never used";
                }
                self.setState({ applications: data.applications });
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    revoke: function(application: types.Application) {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + `/api/user/authorized/${application.id}`,
            method: "DELETE",
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success");
                self.setState({ application: null });
                self.get();
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
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
            application: null,
        } as State;
    },
    render: function() {
        let self: Self = this;

        let applicationsView = self.state.applications.map(application => {
            return (
                <tr key={application.id}>
                    <td>
                        <a href="javascript:void(0)" onClick={self.show.bind(this, application)}>{application.name}</a>
                        <p>
                            owned by: {application.creator.name}
                            •
                            last used: {application.lastUsed}
                        </p>
                    </td>
                    <td style={{ width: 70 + "px" }}>
                        <button type="button" className="btn btn-danger" onClick={self.revoke.bind(this, application)}>Revoke</button>
                    </td>
                </tr>
            );
        });

        let applicationView;
        if (self.state.application) {
            let scopesView = self.state.application.scopes.map(scope => {
                return (
                    <tr key={scope.name}>
                        <td>{scope.name}</td>
                        <td>{scope.description}</td>
                    </tr>
                );
            });
            applicationView = (
                <form className="form">
                    <div className="form-group">
                        <label>name</label>
                        <input type="text" className="form-control" readOnly value={self.state.application.name}/>
                    </div>
                    <div className="form-group">
                        <label>home url</label>
                        <input type="text" className="form-control" readOnly value={self.state.application.homeUrl}/>
                    </div>
                    <div className="form-group">
                        <label>description</label>
                        <input type="text" className="form-control" readOnly value={self.state.application.description}/>
                    </div>
                    <div className="form-group">
                        <label>scopes</label>
                        <table>
                            <tbody>
                                {scopesView}
                            </tbody>
                        </table>
                    </div>
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
                                Authorized applications
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
