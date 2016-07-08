import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

type State = {
    email?: string;
    organizationsCurrentUserCreated?: types.Organization[];
    currentOrganizationId?: string;
    requestCount?: number;
};

type Self = types.Self<State> & {
    getOrganizationsCurrentUserCreated: () => void;
    invite: (e: common.Event) => void;
    clickOrganization: (organization: types.Organization) => void;

    emailChanged: (e: common.Event) => void;
};

const spec: Self = {
    getOrganizationsCurrentUserCreated: function(this: Self) {
        $.ajax({
            url: apiBaseUrl + "/api/user/created",
            cache: false,
        }).then((data: types.OrganizationsResponse) => {
            if (data.status === 0) {
                this.setState!({ organizationsCurrentUserCreated: data.organizations });
                if (data.organizations.length > 0) {
                    const lastOrganizationId = window.localStorage.getItem(common.localStorageNames.lastOrganizationId);
                    if (lastOrganizationId && common.find(data.organizations, o => o.id === lastOrganizationId)) {
                        this.setState!({ currentOrganizationId: lastOrganizationId });
                    } else {
                        this.setState!({ currentOrganizationId: data.organizations[0].id });
                    }
                }
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    invite: function(this: Self, e: common.Event) {
        $.ajax({
            url: apiBaseUrl + "/api/users/" + this.state!.email + "/joined/" + this.state!.currentOrganizationId,
            data: {},
            cache: false,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    clickOrganization: function(this: Self, organization: types.Organization) {
        this.setState!({ currentOrganizationId: organization.id });

        window.localStorage.setItem(common.localStorageNames.lastOrganizationId, organization.id);
    },
    emailChanged: function(this: Self, e: common.Event) {
        this.setState!({ email: e.target.value });
    },
    componentDidMount: function(this: Self) {
        global.body = this;
        this.getOrganizationsCurrentUserCreated();
    },
    componentWillUnmount: function() {
        global.body = undefined;
    },
    getInitialState: function() {
        return {
            email: "",
            organizationsCurrentUserCreated: [],
            currentOrganizationId: "",
            requestCount: 0,
        } as State;
    },
    render: function(this: Self) {
        let inviteView: JSX.Element | undefined = undefined;
        if (common.isEmail(this.state!.email!.trim()) && this.state!.requestCount === 0) {
            inviteView = (
                <button type="button" className="btn btn-primary" onClick={this.invite}>Invite</button>
            );
        } else {
            inviteView = (
                <button type="button" className="btn btn-primary" disabled>Please input invitee's email</button>
            );
        }
        const organizationsView = this.state!.organizationsCurrentUserCreated!.map(organization => {
            return (
                <label className={ "the-label " + (this.state!.currentOrganizationId === organization.id ? "label-active" : "") } key={organization.id} onClick={this.clickOrganization.bind(this, organization)}>
                    {organization.name}
                </label>
            );
        });

        return (
            <div>
                <HeadComponent/>
                <div className="container body-container">
                    <div className="row">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                Invite
                            </div>
                            <div className="panel-body">
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <div className="col-sm-12">
                                            {organizationsView}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">
                                            <span className="glyphicon glyphicon-envelope"></span>
                                        </label>

                                        <div className="col-sm-4">
                                            <input type="text" className="form-control" onChange={this.emailChanged} value={this.state!.email}/>
                                        </div>

                                        <div className="col-sm-2">
                                            {inviteView}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

export const InviteComponent = React.createClass(spec);
