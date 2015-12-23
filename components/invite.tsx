import * as types from "./types";
import {HeadComponent, events} from "./head";
import * as common from "./common";

let Link = ReactRouter.Link;

interface State {
    email?: string;
    organizationsCurrentUserCreated?: types.Organization[];
    currentOrganizationId?: string;
}

interface Self {
    state: State;
    setState: (state: State) => void;
    getOrganizationsCurrentUserCreated: () => void;
    invite: () => void;
    clickOrganization: (organization: types.Organization) => void;
    emailChanged: (e) => void;
}

export let InviteComponent = React.createClass({
    getOrganizationsCurrentUserCreated: function() {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + "/api/user/created",
            cache: false,
        }).then((data: types.OrganizationsResponse) => {
            if (data.isSuccess) {
                self.setState({ organizationsCurrentUserCreated: data.organizations });
                if (data.organizations.length > 0) {
                    let lastOrganizationId = window.localStorage.getItem(common.localStorageNames.lastOrganizationId);
                    if (lastOrganizationId && ~_.findIndex(data.organizations, o => o.id === lastOrganizationId)) {
                        self.setState({ currentOrganizationId: lastOrganizationId });
                    } else {
                        self.setState({ currentOrganizationId: data.organizations[0].id });
                    }
                }
            } else {
                events.showAlert(false, data.errorMessage);
            }
        });
    },
    invite: function(e) {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + "/api/users/" + self.state.email + "/joined/" + self.state.currentOrganizationId,
            data: {},
            cache: false,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                events.showAlert(true, "success");
            } else {
                events.showAlert(false, data.errorMessage);
            }
        });
    },
    clickOrganization: function(organization: types.Organization) {
        let self: Self = this;

        self.setState({ currentOrganizationId: organization.id });

        window.localStorage.setItem(common.localStorageNames.lastOrganizationId, organization.id);
    },
    emailChanged: function(e) {
        let self: Self = this;

        self.setState({ email: e.target.value });
    },
    componentWillMount: function() {
        let self: Self = this;

        events.authenticated = self.getOrganizationsCurrentUserCreated;
    },
    getInitialState: function() {
        return {
            email: "",
            organizationsCurrentUserCreated: [],
            currentOrganizationId: "",
        } as State;
    },
    render: function() {
        let self: Self = this;

        let inviteView;
        if (common.isEmail(self.state.email.trim()) && events.getRequestCount() === 0) {
            inviteView = (
                <button type="button" className="btn btn-primary"
                    onClick={self.invite}>
                    Invite
                </button>
            );
        } else {
            inviteView = (
                <button type="button" className="btn btn-primary" disabled>
                    Please input invitee's email
                </button>
            );
        }
        let organizationsView = self.state.organizationsCurrentUserCreated.map(organization => {
            if (self.state.currentOrganizationId === organization.id) {
                return (
                    <label className="the-label label-active" key={organization.id}
                        onClick={self.clickOrganization.bind(this, organization)}>
                        {organization.name}
                    </label>
                );
            } else {
                return (
                    <label className="the-label" key={organization.id}
                        onClick={self.clickOrganization.bind(this, organization)}>
                        {organization.name}
                    </label>
                );
            }
        });

        return (
            <div>
                <HeadComponent/>
                <div className="container" style={{ marginTop: 60 + "px" }}>
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
                                            <input type="text" className="form-control" onChange={self.emailChanged}/>
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
});
