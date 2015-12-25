import * as types from "../share/types";
import * as common from "./common";

interface State {
    message?: string;
}

interface Self extends types.Self<State> { }

export let ErrorComponent = common.React.createClass({
    getInitialState: function() {
        return {
            message: decodeURIComponent(common.getUrlParameter("message"))
        } as State;
    },
    render: function() {
        let self: Self = this;
        return (
            <div className="container" style={{ marginTop: 60 + "px" }}>
                <div className="row">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="alert alert-danger" role="alert">
                                <span>{self.state.message}</span>
                                go to <common.Link to="/" className="alert-link">Home page</common.Link> now.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});
