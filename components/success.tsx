import * as common from "./common";

export let SuccessComponent = React.createClass({
    getInitialState: () => {
        let willClearPreviousStatus = common.getUrlParameter("clear_previous_status");

        if (willClearPreviousStatus === common.yes) {
            window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
        }

        let redirectUrl = common.getUrlParameter("redirect_url");

        return {
            redirectUrl: redirectUrl ? decodeURIComponent(redirectUrl) : ""
        };
    },
    render: function() {
        let redirectUrlView;
        if (this.state.redirectUrl) {
            redirectUrlView = (
                <span>
                    or <a href={this.state.redirectUrl} className="alert-link">Continue</a>
                </span>
            );
        }
        return (
            <div className="container" style={{ marginTop: 60 + "px" }}>
                <div className="row">
                    <div className="panel panel-default">
                        <div className="panel-body" id="vue-body">
                            <div className="alert alert-success" role="alert">
                                success! go to <a href="#/" className="alert-link">Home page</a> now.
                                {redirectUrlView}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
