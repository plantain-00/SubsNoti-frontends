import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

interface State {
    email?: string;
    organizationsCurrentUserCreated?: types.Organization[];
    currentOrganizationId?: string;
    requestCount?: number;
}

interface Self extends types.Self<State> {
    getOrganizationsCurrentUserCreated: () => void;
    invite: (e) => void;
    clickOrganization: (organization: types.Organization) => void;

    emailChanged: (e) => void;
}

const spec: Self = {
    getOrganizationsCurrentUserCreated: function() {
        const self: Self = this;

        $.ajax({
            url: apiBaseUrl + "/api/user/created",
            cache: false,
        }).then((data: types.OrganizationsResponse) => {
            if (data.status === 0) {
                self.setState({ organizationsCurrentUserCreated: data.organizations });
                if (data.organizations.length > 0) {
                    const lastOrganizationId = window.localStorage.getItem(common.localStorageNames.lastOrganizationId);
                    if (lastOrganizationId && common.find(data.organizations, o => o.id === lastOrganizationId)) {
                        self.setState({ currentOrganizationId: lastOrganizationId });
                    } else {
                        self.setState({ currentOrganizationId: data.organizations[0].id });
                    }
                }
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    invite: function(e) {
        const self: Self = this;

        $.ajax({
            url: apiBaseUrl + "/api/users/" + self.state.email + "/joined/" + self.state.currentOrganizationId,
            data: {},
            cache: false,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head.showAlert(true, "success");
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    clickOrganization: function(organization: types.Organization) {
        const self: Self = this;

        self.setState({ currentOrganizationId: organization.id });

        window.localStorage.setItem(common.localStorageNames.lastOrganizationId, organization.id);
    },
    emailChanged: function(e) {
        const self: Self = this;

        self.setState({ email: e.target.value });
    },
    componentDidMount: function() {
        const self: Self = this;

        global.body = self;
        self.getOrganizationsCurrentUserCreated();
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
    render: function() {
        const self: Self = this;

        let inviteView;
        if (common.isEmail(self.state.email.trim()) && self.state.requestCount === 0) {
            inviteView = (
                <button type="button" className="btn btn-primary" onClick={self.invite}>Invite</button>
            );
        } else {
            inviteView = (
                <button type="button" className="btn btn-primary" disabled>Please input invitee's email</button>
            );
        }
        const organizationsView = self.state.organizationsCurrentUserCreated.map(organization => {
            return (
                <label className={ "the-label " + (self.state.currentOrganizationId === organization.id ? "label-active" : "") } key={organization.id} onClick={self.clickOrganization.bind(this, organization)}>
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
                                            <input type="text" className="form-control" onChange={self.emailChanged} value={self.state.email}/>
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
