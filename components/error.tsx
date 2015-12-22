import * as common from "./common";

export let ErrorComponent = React.createClass({
    getInitialState: () => {
        return {
            message: decodeURIComponent(common.getUrlParameter("message"))
        };
    },
    render: function() {
        return (
            <div className="container" style={{ marginTop: 60 + "px" }}>
                <div className="row">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="alert alert-danger" role="alert">
                                <span>{this.state.message}</span>
                                go to <a href="#/" className="alert-link">Home page</a> now.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});
