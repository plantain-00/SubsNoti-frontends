import * as types from "./types";
import * as common from "./common";

let Link = ReactRouter.Link;

interface CurrentUserResponse extends types.Response {
    user: types.User;
}

export let itemLimit = 10;
export let maxOrganizationNumberUserCanCreate = 3;

export function getFullUrl(avatar: string): string {
    return `${imageServerBaseUrl}/${avatar}`;
}

function getCurrentUser(next: (data: CurrentUserResponse) => void) {
    let loginResult = window.sessionStorage.getItem(common.sessionStorageNames.loginResult);

    if (loginResult) {
        let data: CurrentUserResponse = JSON.parse(loginResult);

        next(data);
    } else {
        $.ajax({
            url: apiBaseUrl + "/api/user",
            cache: false,
        }).then((data: CurrentUserResponse) => {
            window.sessionStorage.setItem(common.sessionStorageNames.loginResult, JSON.stringify(data));

            next(data);
        });
    }
}

$.ajaxSetup({
    headers: {
        "X-Version": version
    },
    xhrFields: {
        withCredentials: true
    },
});

export let events: {
    showAlert?: (isSuccess: boolean, message: string) => void;
    addOrganization?: () => void;
    getRequestCount?: () => number;
    setRequestCount?: (count: number) => void;
    authenticated?: (error: Error) => void;
} = new Object();

$(document).ajaxSend(() => {
    events.setRequestCount(events.getRequestCount() + 1);
}).ajaxComplete(() => {
    events.setRequestCount(events.getRequestCount() - 1);
}).ajaxError(() => {
    events.showAlert(false, "something happens unexpectedly, see console to get more details.");
});

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

export let HeadComponent = React.createClass({
    exit: function() {
        let self: Self = this;

        $.ajax({
            type: "DELETE",
            url: apiBaseUrl + "/api/user/logged_in",
            cache: false,
        }).then((data: CurrentUserResponse) => {
            if (data.isSuccess) {
                self.setState({
                    loginStatus: types.loginStatus.fail,
                    currentUserId: "",
                    currentUserName: "",
                    currentUserEmail: "",
                    currentAvatar: "",
                    createdOrganizationCount: maxOrganizationNumberUserCanCreate,
                    joinedOrganizationCount: 0,
                });
                window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
            } else {
                self.showAlert(false, data.errorMessage);
            }
        });
    },
    showAlert: function(isSuccess: boolean, message: string) {
        let self: Self = this;

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
        let self: Self = this;

        getCurrentUser(data => {
            if (data.isSuccess) {
                self.setState({
                    loginStatus: types.loginStatus.success,
                    currentUserId: data.user.id,
                    currentUserName: data.user.name,
                    currentUserEmail: data.user.email,
                    currentAvatar: getFullUrl(data.user.avatar),
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
    componentWillMount: function() {
        let self: Self = this;

        events.showAlert = self.showAlert;
        events.addOrganization = () => {
            self.setState({ createdOrganizationCount: self.state.createdOrganizationCount + 1 });
        };
        events.getRequestCount = () => {
            return self.state.requestCount;
        };
        events.setRequestCount = count => {
            self.setState({ requestCount: count });
        };

        $(document).ready(function() {
            self.authenticate(error => {
                if (error) {
                    console.log(error);
                }

                if (events.authenticated) {
                    events.authenticated(error);
                }
            });
        });
    },
    componentWillUnmount: function() {
        events.showAlert = undefined;
        events.addOrganization = undefined;
        events.getRequestCount = undefined;
        events.setRequestCount = undefined;
    },
    getInitialState: function() {
        return {
            loginStatus: types.loginStatus.unknown,
            currentUserId: "",
            currentUserName: "",
            currentUserEmail: "",
            currentAvatar: "",
            createdOrganizationCount: maxOrganizationNumberUserCanCreate,
            joinedOrganizationCount: 0,
            requestCount: 0,
            alertIsSuccess: true,
            showAlertMessage: false,
            alertMessage: "",
        } as State;
    },
    render: function() {
        let self: Self = this;

        let createOrganizationView;
        if (self.state.createdOrganizationCount < maxOrganizationNumberUserCanCreate) {
            createOrganizationView = (
                <li>
                    <Link to="/new_organization">New Organization</Link>
                </li>
            );
        }
        let inviteView;
        if (self.state.joinedOrganizationCount > 0) {
            inviteView = (
                <li>
                    <Link to="/invite">Invite</Link>
                </li>
            );
        }
        let registeredView;
        let authorizedView;
        let sccessTokenView;
        let logoutView;
        if (self.state.loginStatus === types.loginStatus.success) {
            registeredView = (
                <li>
                    <Link to="/registered">Registered</Link>
                </li>
            );
            authorizedView = (
                <li>
                    <Link to="/authorized">Authorized</Link>
                </li>
            );
            sccessTokenView = (
                <li>
                    <Link to="/access_tokens">Access tokens</Link>
                </li>
            );
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
                        <span className="glyphicon glyphicon-user" style={{ top: 2 + "px" }}></span> &nbsp;
                        <span>Login now...</span>
                    </a>
                );
                break;
            case types.loginStatus.success:
                loginView = (
                    <Link to="/user">
                        <span className="glyphicon glyphicon-user" style={{ top: 2 + "px" }}></span> &nbsp;
                        <span>{self.state.currentUserName}</span>
                        <span className="glyphicon glyphicon-envelope" style={{ top: 2 + "px" }}></span> &nbsp;
                        <span>{self.state.currentUserEmail}</span>
                        <img src={self.state.currentAvatar} style={{ height: 20 + "px", width: 20 + "px" }}/>
                    </Link>
                );
                break;
            case types.loginStatus.fail:
                loginView = (
                    <Link to="/login">
                        <span className="glyphicon glyphicon-user" style={{ top: 2 + "px" }}></span> &nbsp;Login
                    </Link>
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
                        <span className="fa fa-github" style={{ top: 2 + "px" }}></span> &nbsp;Login with Github
                    </a>
                </li>
            );
        }
        let alertMessageView;
        if (self.state.showAlertMessage) {
            alertMessageView = (
                <div className="alert alert-{{alertIsSuccess ? 'success' : 'danger'}}" role="alert"
                    style={{ position: "fixed", top: 60 + "px", left: 20 + "px", right: 20 + "px", zIndex: 1 }}>
                    {self.state.alertMessage}
                </div>
            );
        }
        let waitView;
        if (self.state.requestCount > 0) {
            waitView = (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, textAlign: "center", zIndex: 1 }}>
                    <i className="fa fa-spinner fa-pulse fa-5x" style={{ marginTop: 200 + "px" }}></i>
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
                        <Link className="navbar-brand hidden-sm" to="/">Home</Link>
                    </div>
                    <div className="collapse navbar-collapse" role="navigation" id="navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to="/">Themes</Link>
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
});
