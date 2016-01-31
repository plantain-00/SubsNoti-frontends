import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

interface State {
    emailHead?: string;
    emailTail?: string;
    innerName?: string;
    innerRawEmail?: string;
    captchaUrl?: string;
    code?: string;
    redirectUrl?: string;
    requestCount?: number;
}

interface Self extends types.Self<State> {
    login: () => void;
    refreshCaptcha: () => void;
    getName: () => void;
    setRawEmail: (email: string) => void;

    rawEmailChanged: (e) => void;
    nameChanged: (e) => void;
    codeChanged: (e) => void;
}

const guid = common.guid();

const spec: Self = {
    login: function() {
        const self: Self = this;

        const lastSuccessfulEmailTime: string = window.localStorage.getItem(common.localStorageNames.lastSuccessfulEmailTime);
        if (lastSuccessfulEmailTime) {
            const time = new Date().getTime() - parseInt(lastSuccessfulEmailTime, 10);
            if (time < 60 * 1000) {
                global.head.showAlert(false, "please do it after " + (60 - time / 1000) + " seconds");
                return;
            }
        }

        $.post(apiBaseUrl + "/api/tokens", {
            email: `${self.state.emailHead}@${self.state.emailTail}`,
            name: self.getName(),
            guid: guid,
            code: self.state.code,
            redirectUrl: self.state.redirectUrl,
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success, please check your email.");
                window.localStorage.setItem(common.localStorageNames.lastSuccessfulEmailTime, new Date().getTime().toString());
            } else {
                global.head.showAlert(false, data.errorMessage);
                self.refreshCaptcha();
            }
        });
    },
    refreshCaptcha: function() {
        const self: Self = this;

        $.post(apiBaseUrl + "/api/captchas", {
            id: guid
        }).then((data: types.CaptchaResponse) => {
            if (data.isSuccess) {
                self.setState({ captchaUrl: data.url });
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    getName: function() {
        const self: Self = this;

        if (self.state.innerName) {
            return self.state.innerName;
        }
        return self.state.emailHead;
    },
    setRawEmail: function(email: string) {
        const self: Self = this;

        if (common.isEmail(email)) {
            const tmp = email.trim().toLowerCase().split("@");
            self.setState({
                emailHead: tmp[0],
                emailTail: tmp[1],
                innerRawEmail: email,
            });
        } else {
            self.setState({
                emailHead: "",
                emailTail: "",
                innerRawEmail: email,
            });
        }
    },
    rawEmailChanged: function(e) {
        const self: Self = this;

        self.setRawEmail(e.target.value);
    },
    nameChanged: function(e) {
        const self: Self = this;

        const name: string = e.target.value;
        self.setState({ innerName: name.trim() });
    },
    codeChanged: function(e) {
        const self: Self = this;

        self.setState({ code: e.target.value });
    },
    componentWillUnmount: function() {
        global.authenticated = undefined;
        global.body = undefined;
    },
    getInitialState: function() {
        const self: Self = this;

        global.body = self;
        global.authenticated = error => {
            if (error) {
                self.setRawEmail(window.localStorage.getItem(common.localStorageNames.lastLoginEmail));
                self.setState({
                    innerName: window.localStorage.getItem(common.localStorageNames.lastLoginName),
                    redirectUrl: decodeURIComponent(common.getUrlParameter("redirect_url")),
                });
                self.refreshCaptcha();
                return;
            }

            alert("You are already logged in, will be redirect to home page now.");
            location.href = "/";
        };

        return {
            emailHead: "",
            emailTail: "",
            innerName: "",
            innerRawEmail: "",
            captchaUrl: "",
            code: "",
            redirectUrl: "",
            requestCount: 0,
        } as State;
    },
    render: function() {
        const self: Self = this;

        let loginView;
        if (self.state.emailHead && self.state.emailTail && self.state.code && self.state.requestCount === 0) {
            loginView = (
                <button type="button" className="btn btn-primary" onClick={self.login}>
                    Login
                </button>
            );
        } else {
            loginView = (
                <button type="button" className="btn btn-primary" disabled>
                    Please input email and code
                </button>
            );
        }

        let captchaView;
        if (self.state.captchaUrl) {
            captchaView = (
                <div className="col-sm-2">
                    <img src={self.state.captchaUrl}/>
                    <span className="glyphicon glyphicon-refresh pointer" aria-hidden="true" onClick={self.refreshCaptcha}></span>
                </div>
            );
        }

        return (
            <div>
                <HeadComponent/>
                <div className="container body-container">
                    <div className="row">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                Login
                            </div>
                            <div className="panel-body">
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <label className="col-sm-1 control-label">
                                            <span className="glyphicon glyphicon-envelope"></span>
                                        </label>

                                        <div className="col-sm-4">
                                            <input type="text" className="form-control" onChange={self.rawEmailChanged} value={self.state.innerRawEmail}/>
                                        </div>

                                        <label className="col-sm-1 control-label">name:</label>

                                        <div className="col-sm-2">
                                            <input type="text" className="form-control" onChange={self.nameChanged} value={self.state.innerName}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        {captchaView}
                                        <div className="col-sm-2">
                                            <input type="text" className="form-control" onChange={self.codeChanged} value={self.state.code}/>
                                        </div>
                                        <div className="col-sm-4">
                                            {loginView}
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

export const LoginComponent = React.createClass(spec);
