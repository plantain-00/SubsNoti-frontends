import * as types from "./types";
import {HeadComponent, global} from "./head";

interface State {
    organizationName?: string;
}

interface Self extends types.Self<State> {
    add: () => void;

    organizationNameChanged: () => void;
}

export let NewOrganizationComponent = React.createClass({
    add: function() {
        let self: Self = this;

        $.post(apiBaseUrl + "/api/organizations", {
            organizationName: self.state.organizationName
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.setState({ createdOrganizationCount: global.head.state.createdOrganizationCount + 1 });
                global.head.showAlert(true, "success");
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    organizationNameChanged: function(e) {
        let self: Self = this;

        self.setState({ organizationName: e.target.value });
    },
    getInitialState: function() {
        return {
            organizationName: ""
        } as State;
    },
    render: function() {
        let self: Self = this;

        let addView;
        if (self.state.organizationName.trim()) {
            addView = (
                <button type="button" className="btn btn-primary" onClick={self.add}>Add</button>
            );
        } else {
            addView = (
                <button type="button" className="btn btn-primary" disabled>Please input organization name</button>
            );
        }
        return (
            <div>
                <HeadComponent/>
                <div className="container" style={{ marginTop: 60 + "px" }}>
                    <div className="row">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                New Organization
                            </div>
                            <div className="panel-body">
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">organization name:</label>

                                        <div className="col-sm-4">
                                            <input type="text" className="form-control" value={self.state.organizationName} onChange={self.organizationNameChanged}/>
                                        </div>

                                        <div className="col-sm-2">
                                            {addView}
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
