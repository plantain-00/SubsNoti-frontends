import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as React from "react";

type State = {
    applications?: types.Application[];
    application?: types.Application;
};

type Self = types.Self<State> & {
    show: (application: types.Application) => void;
    get: () => void;
    revoke: (application: types.Application) => void;
};

const spec: Self = {
    show: function(this: Self, application: types.Application) {
        this.state!.application = application;
    },
    get: function(this: Self) {
        $.ajax({
            url: apiBaseUrl + "/api/user/authorized",
            cache: false,
        }).then((data: types.ApplicationsResponse) => {
            if (data.status === 0) {
                for (const application of data.applications) {
                    application.lastUsed = application.lastUsed ? moment(application.lastUsed, moment.ISO_8601).fromNow() : "never used";
                }
                this.setState!({ applications: data.applications });
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    revoke: function(this: Self, application: types.Application) {
        $.ajax({
            url: apiBaseUrl + `/api/user/authorized/${application.id}`,
            method: "DELETE",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
                this.setState!({ application: undefined });
                this.get();
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    componentDidMount: function(this: Self) {
        this.get();
    },
    getInitialState: function() {
        return {
            applications: [],
            application: undefined,
        } as State;
    },
    render: function(this: Self) {
        const applicationsView = this.state!.applications!.map(application => {
            return (
                <tr key={application.id}>
                    <td>
                        <a href="javascript:void(0)" onClick={this.show.bind(this, application)}>{application.name}</a>
                        <p>
                            owned by: {application.creator!.name}
                            •
                            last used: {application.lastUsed}
                        </p>
                    </td>
                    <td className="authorized-application">
                        <button type="button" className="btn btn-danger" onClick={this.revoke.bind(this, application)}>Revoke</button>
                    </td>
                </tr>
            );
        });

        let applicationView: JSX.Element | undefined = undefined;
        if (this.state!.application) {
            const scopesView = this.state!.application!.scopes!.map(scope => {
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
                        <input type="text" className="form-control" readOnly value={this.state!.application!.name}/>
                    </div>
                    <div className="form-group">
                        <label>home url</label>
                        <input type="text" className="form-control" readOnly value={this.state!.application!.homeUrl}/>
                    </div>
                    <div className="form-group">
                        <label>description</label>
                        <input type="text" className="form-control" readOnly value={this.state!.application!.description}/>
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
                <div className="container body-container">
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
};

export const AuthorizedComponent = React.createClass(spec);
