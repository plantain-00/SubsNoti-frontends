import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

interface State {
    organizationName?: string;
}

interface Self extends types.Self<State> {
    add: () => void;

    organizationNameChanged: (e) => void;
}

function add() {
    const self: Self = this;

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
}

const AddView = ({organizationName}) => {
    if (organizationName.trim()) {
        return (
            <button type="button" className="btn btn-primary" onClick={add}>Add</button>
        );
    } else {
        return (
            <button type="button" className="btn btn-primary" disabled>Please input organization name</button>
        );
    }
};

const spec: Self = {
    add: function() {
        const self: Self = this;

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
        const self: Self = this;

        self.setState({ organizationName: e.target.value });
    },
    getInitialState: function() {
        return {
            organizationName: ""
        } as State;
    },
    render: function() {
        const self: Self = this;

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
                <div className="container body-container">
                    <div className="row">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                New Organization
                            </div>
                            <div className="panel-body">
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">organization name: </label>

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
};

export const NewOrganizationComponent = React.createClass(spec);
