let React = window.React;
import * as types from "./types";
import {HeadComponent, showAlert, addOrganization} from "./head";

export let NewOrganizationComponent = React.createClass({
    add: function() {
        let self = this;

        $.post(apiBaseUrl + "/api/organizations", {
            organizationName: self.state.organizationName
        }).then(data => {
            if (data.isSuccess) {
                addOrganization();
                showAlert(true, "success");
            } else {
                showAlert(false, data.errorMessage);
            }
        });
    },
    organizationNameChanged: function(e) {
        this.setState({ organizationName: e.target.value });
    },
    getInitialState: () => {
        return {
            organizationName: ""
        };
    },
    render: function() {
        let addView = "";
        if (this.state.organizationName.trim()) {
            addView = (
                <button type="button" className="btn btn-primary" onClick={this.add}>
                    Add
                </button>
            );
        } else {
            addView = (
                <button type="button" className="btn btn-primary" disabled>
                    Please input organization name
                </button>
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
                                            <input type="text" className="form-control" value={this.state.organizationName} onChange={this.organizationNameChanged}/>
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
    }
});
