import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

type State = {
    organizationName?: string;
};

type Self = types.Self<State> & {
    add: () => void;

    organizationNameChanged: (e: common.Event) => void;
};

const spec: Self = {
    add: function(this: Self) {
        $.post(apiBaseUrl + "/api/organizations", {
            organizationName: this.state!.organizationName,
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.setState!({ createdOrganizationCount: global.head!.state!.createdOrganizationCount + 1 });
                global.head!.showAlert(true, "success");
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    organizationNameChanged: function(this: Self, e: common.Event) {
        this.setState!({ organizationName: e.target.value });
    },
    getInitialState: function() {
        return {
            organizationName: "",
        } as State;
    },
    render: function(this: Self) {
        let addView: JSX.Element | undefined = undefined;
        if (this.state!.organizationName!.trim()) {
            addView = (
                <button type="button" className="btn btn-primary" onClick={this.add}>Add</button>
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
                                            <input type="text" className="form-control" value={this.state!.organizationName} onChange={this.organizationNameChanged}/>
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
