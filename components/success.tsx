import * as common from "./common";

let Link = ReactRouter.Link;

interface State {
    redirectUrl?: string;
}

interface Self {
    state: State;
    setState: (state: State) => void;
}

export let SuccessComponent = React.createClass({
    getInitialState: function() {
        let willClearPreviousStatus = common.getUrlParameter("clear_previous_status");

        if (willClearPreviousStatus === common.yes) {
            window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
        }

        let redirectUrl = common.getUrlParameter("redirect_url");

        return {
            redirectUrl: redirectUrl ? decodeURIComponent(redirectUrl) : ""
        } as State;
    },
    render: function() {
        let self: Self = this;

        let redirectUrlView;
        if (self.state.redirectUrl) {
            redirectUrlView = (
                <span>
                    or <a href={self.state.redirectUrl} className="alert-link">Continue</a>
                </span>
            );
        }
        return (
            <div className="container" style={{ marginTop: 60 + "px" }}>
                <div className="row">
                    <div className="panel panel-default">
                        <div className="panel-body" id="vue-body">
                            <div className="alert alert-success" role="alert">
                                success! go to <Link to="/" className="alert-link">Home page</Link> now.
                                {redirectUrlView}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});
