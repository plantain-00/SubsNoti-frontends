import * as types from "../share/types";
import * as common from "./common";
import * as React from "react";

function getCurrentUser(next: (data: types.CurrentUserResponse) => void) {
    const loginResult = window.sessionStorage.getItem(common.sessionStorageNames.loginResult);

    if (loginResult) {
        const data: types.CurrentUserResponse = JSON.parse(loginResult);

        next(data);
    } else {
        $.ajax({
            url: apiBaseUrl + "/api/user",
            cache: false,
        }).then((data: types.CurrentUserResponse) => {
            window.sessionStorage.setItem(common.sessionStorageNames.loginResult, JSON.stringify(data));

            next(data);
        });
    }
}

export const global: {
    authenticated?: (error: Error) => void;
    body?: types.Self<{ requestCount?: number }>;
    head?: Self;
    scrolled?: () => void;
    themeCreated?: (theme: types.Theme) => void;
    themeUpdated?: (theme: types.Theme) => void;
    win?: JQuery;
    doc?: JQuery;
} = new Object();

let timeoutId;

interface State {
    loginStatus?: types.LoginStatus;
    currentUserId?: string;
    currentUserName?: string;
    currentUserEmail?: string;
    currentAvatar?: string;
    createdOrganizationCount?: number;
    joinedOrganizationCount?: number;
    requestCount?: number;
    alertIsSuccess?: boolean;
    showAlertMessage?: boolean;
    alertMessage?: string;
}

interface Self extends types.Self<State> {
    showAlert: (isSuccess: boolean, message: string) => void;
    authenticate: (next: (error: Error) => void) => void;
    exit: () => void;
}

const spec: Self = {
    exit: function() {
        const self: Self = this;

        $.ajax({
            type: "DELETE",
            url: apiBaseUrl + "/api/user/logged_in",
            cache: false,
        }).then((data: types.CurrentUserResponse) => {
            if (data.status === 0) {
                self.setState({
                    loginStatus: types.loginStatus.fail,
                    currentUserId: "",
                    currentUserName: "",
                    currentUserEmail: "",
                    currentAvatar: "",
                    createdOrganizationCount: common.maxOrganizationNumberUserCanCreate,
                    joinedOrganizationCount: 0,
                });
                window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
            } else {
                self.showAlert(false, data.errorMessage);
            }
        });
    },
    showAlert: function(isSuccess: boolean, message: string) {
        const self: Self = this;

        self.setState({
            alertIsSuccess: isSuccess,
            alertMessage: message,
            showAlertMessage: true,
        });

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            self.setState({ showAlertMessage: false });
            timeoutId = null;
        }, 3000);
    },
    authenticate: function(next: (error: Error) => void) {
        const self: Self = this;

        getCurrentUser(data => {
            if (data.status === 0) {
                self.setState({
                    loginStatus: types.loginStatus.success,
                    currentUserId: data.user.id,
                    currentUserName: data.user.name,
                    currentUserEmail: data.user.email,
                    currentAvatar: common.getFullUrl(data.user.avatar),
                    createdOrganizationCount: data.user.createdOrganizationCount,
                    joinedOrganizationCount: data.user.joinedOrganizationCount,
                });

                window.localStorage.setItem(common.localStorageNames.lastLoginEmail, data.user.email);
                window.localStorage.setItem(common.localStorageNames.lastLoginName, data.user.name);

                next(null);
            } else {
                self.setState({ loginStatus: types.loginStatus.fail });
                next(new Error(data.errorMessage));
            }
        });
    },
    componentDidMount: function() {
        const self: Self = this;

        global.head = self;

        $(document).ready(function() {
            self.authenticate(error => {
                if (error) {
                    console.log(error);
                }

                if (global.authenticated) {
                    global.authenticated(error);
                }
            });
        });
    },
    componentWillUnmount: function() {
        global.head = undefined;
        global.authenticated = undefined;
        clearTimeout(timeoutId);
        timeoutId = null;
    },
    getInitialState: function() {
        return {
            loginStatus: types.loginStatus.unknown,
            currentUserId: "",
            currentUserName: "",
            currentUserEmail: "",
            currentAvatar: "",
            createdOrganizationCount: common.maxOrganizationNumberUserCanCreate,
            joinedOrganizationCount: 0,
            requestCount: 0,
            alertIsSuccess: true,
            showAlertMessage: false,
            alertMessage: "",
        } as State;
    },
    render: function() {
        const self: Self = this;

        const createOrganizationView = (
            <li>
                <common.Link to="/new_organization.html">New Organization</common.Link>
            </li>
        );
        const inviteView = (
            <li>
                <common.Link to="/invite.html">Invite</common.Link>
            </li>
        );
        const registeredView = (
            <li>
                <common.Link to="/registered.html">Registered</common.Link>
            </li>
        );
        const authorizedView = (
            <li>
                <common.Link to="/authorized.html">Authorized</common.Link>
            </li>
        );
        const sccessTokenView = (
            <li>
                <common.Link to="/access_tokens.html">Access tokens</common.Link>
            </li>
        );
        let logoutView;
        if (self.state.loginStatus === types.loginStatus.success) {
            logoutView = (
                <li>
                    <a href="javascript:void(0)" onClick={self.exit}>
                        <span className="glyphicon glyphicon-log-out" aria-hidden="true"></span>
                    </a>
                </li>
            );
        }
        let loginView;
        switch (self.state.loginStatus) {
            case types.loginStatus.unknown:
                loginView = (
                    <a href="javascript:void(0)">
                        <span className="glyphicon glyphicon-user head-icon"></span> &nbsp;
                        <span>Login now...</span>
                    </a>
                );
                break;
            case types.loginStatus.success:
                loginView = (
                    <common.Link to="/user.html">
                        <span className="glyphicon glyphicon-user head-icon"></span> &nbsp;
                        <span>{self.state.currentUserName}</span>
                        <span className="glyphicon glyphicon-envelope head-icon"></span> &nbsp;
                        <span>{self.state.currentUserEmail}</span>
                        <img src={self.state.currentAvatar} className="head-avatar"/>
                    </common.Link>
                );
                break;
            case types.loginStatus.fail:
                loginView = (
                    <common.Link to="/login.html">
                        <span className="glyphicon glyphicon-user head-icon"></span> &nbsp;Login
                    </common.Link>
                );
                break;
            default:
                break;
        }
        let loginWithGithubView;
        if (self.state.loginStatus === types.loginStatus.fail) {
            loginWithGithubView = (
                <li>
                    <a href={apiBaseUrl + "/login_with_github"}>
                        <span className="fa fa-github head-icon"></span> &nbsp;Login with Github
                    </a>
                </li>
            );
        }
        let alertMessageView;
        if (self.state.showAlertMessage) {
            alertMessageView = (
                <div className={ "head-alert alert alert-" + (self.state.alertIsSuccess ? "success" : "danger")} role="alert">
                    {self.state.alertMessage}
                </div>
            );
        }
        let waitView;
        if (self.state.requestCount > 0) {
            waitView = (
                <div className="head-wait">
                    <i className="fa fa-spinner fa-pulse fa-5x"></i>
                </div>
            );
        }
        return (
            <header className="navbar navbar-inverse" role="banner">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <common.Link className="navbar-brand hidden-sm" to="/">Home</common.Link>
                    </div>
                    <div className="collapse navbar-collapse" role="navigation" id="navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li>
                                <common.Link to="/">Themes</common.Link>
                            </li>
                            {createOrganizationView}
                            {inviteView}
                            {registeredView}
                            {authorizedView}
                            {sccessTokenView}
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                {loginView}
                            </li>
                            {loginWithGithubView}
                            {logoutView}
                        </ul>
                    </div>
                </div>
                {alertMessageView}
                {waitView}
            </header>
        );
    },
};

export const HeadComponent = React.createClass(spec);
