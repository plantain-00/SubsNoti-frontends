import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

interface State {
    name?: string;
}

interface Self extends types.Self<State> {
    save: () => void;
    update: (avatarFileName: string) => void;

    nameChanged: (e) => void;
}

const spec: Self = {
    save: function() {
        const self: Self = this;

        const file = $(":file")[0]["files"][0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            $.ajax({
                url: imageUploaderBaseUrl + "/api/temperary",
                data: formData,
                processData: false,
                contentType: false,
                type: "POST",
            }).then((data: types.TemperaryResponse) => {
                if (data.status === 0) {
                    const name = data.names[0];

                    self.update(name);
                } else {
                    global.head.showAlert(false, data.errorMessage);
                }
            });
        } else {
            self.update(null);
        }
    },
    update: function(avatarFileName: string) {
        const self: Self = this;

        if (self.state.name.trim() !== global.head.state.currentUserName || avatarFileName) {
            $.ajax({
                url: apiBaseUrl + "/api/user",
                data: {
                    name: self.state.name,
                    avatarFileName,
                },
                cache: false,
                type: "PUT",
            }).then((data: types.Response) => {
                if (data.status === 0) {
                    window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);

                    global.head.authenticate(error => { ; });
                    global.head.showAlert(true, "success");
                } else {
                    global.head.showAlert(false, data.errorMessage);
                }
            });
        } else {
            global.head.showAlert(false, "nothing changes.");
        }
    },
    nameChanged: function(e) {
        const self: Self = this;

        self.setState({ name: e.target.value });
    },
    componentWillUnmount: function() {
        global.authenticated = undefined;
    },
    getInitialState: function() {
        const self: Self = this;

        global.authenticated = error => {
            if (error) {
                self.setState({ name: global.head.state.currentUserName });
            }
        };

        return {
            name: "",
        } as State;
    },
    render: function() {
        const self: Self = this;

        let saveView;
        if (self.state.name.trim() !== "") {
            saveView = (
                <button type="button" className="btn btn-primary" onClick={self.save}>Save</button>
            );
        } else {
            saveView = (
                <button type="button" className="btn btn-primary" disabled>name can not be empty </button>
            );
        }

        return (
            <div>
                <HeadComponent/>
                <div className="container body-container">
                    <div className="row">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                User Information
                            </div>
                            <div className="panel-body">
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="col-sm-1 control-label">name:</label>

                                        <div className="col-sm-2">
                                            <input type="text" className="form-control" value={self.state.name} onChange={self.nameChanged}/>
                                        </div>
                                        <label className="col-sm-1 control-label">avatar:</label>
                                        <div className="col-sm-2">
                                            <input type="file" name="avatar"/>
                                        </div>
                                        <div className="col-sm-4">
                                            {saveView}
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

export const UserComponent = React.createClass(spec);
