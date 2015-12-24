import * as types from "./types";
import {HeadComponent, events, head} from "./head";
import * as common from "./common";

interface UploadResponse extends types.Response {
    names: string[];
}

interface State {
    name?: string;
}

interface Self extends types.Self<State> {
    save: () => void;
    update: (avatarFileName: string) => void;

    nameChanged: (e) => void;
}

export let UserComponent = React.createClass({
    save: function() {
        let self: Self = this;

        let file = $(":file")[0]["files"][0];
        if (file) {
            let formData = new FormData();
            formData.append("file", file);

            $.ajax({
                url: imageUploaderBaseUrl + "/api/temperary",
                data: formData,
                processData: false,
                contentType: false,
                type: "POST",
            }).then((data: UploadResponse) => {
                if (data.isSuccess) {
                    let name = data.names[0];

                    self.update(name);
                } else {
                    head.showAlert(false, data.errorMessage);
                }
            });
        } else {
            self.update(null);
        }
    },
    update: function(avatarFileName: string) {
        let self: Self = this;

        if (self.state.name.trim() !== head.state.currentUserName || avatarFileName) {
            $.ajax({
                url: apiBaseUrl + "/api/user",
                data: {
                    name: self.state.name,
                    avatarFileName: avatarFileName,
                },
                cache: false,
                type: "PUT",
            }).then((data: types.Response) => {
                if (data.isSuccess) {
                    window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);

                    head.authenticate(error => { ; });
                    head.showAlert(true, "success");
                } else {
                    head.showAlert(false, data.errorMessage);
                }
            });
        } else {
            head.showAlert(false, "nothing changes.");
        }
    },
    nameChanged: function(e) {
        let self: Self = this;

        self.setState({ name: e.target.value });
    },
    componentWillMount: function() {
        let self: Self = this;

        events.authenticated = error => {
            if (error) {
                self.setState({ name: head.state.currentUserName });
            }
        };
    },
    componentWillUnmount: function() {
        events.authenticated = undefined;
    },
    getInitialState: function() {
        return {
            name: ""
        } as State;
    },
    render: function() {
        let self: Self = this;

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
                <div className="container" style={{ marginTop: 60 + "px" }}>
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
});
