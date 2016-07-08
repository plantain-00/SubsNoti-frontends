import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

type State = {
    emailHead?: string;
    emailTail?: string;
    innerName?: string;
    innerRawEmail?: string;
    captchaUrl?: string;
    code?: string;
    redirectUrl?: string;
    requestCount?: number;
};

type Self = types.Self<State> & {
    login: () => void;
    refreshCaptcha: () => void;
    getName: () => void;
    setRawEmail: (email: string) => void;

    rawEmailChanged: (e: common.Event) => void;
    nameChanged: (e: common.Event) => void;
    codeChanged: (e: common.Event) => void;
};

const guid = common.guid();

const spec: Self = {
    login: function(this: Self) {
        const lastSuccessfulEmailTime: string = window.localStorage.getItem(common.localStorageNames.lastSuccessfulEmailTime);
        if (lastSuccessfulEmailTime) {
            const time = new Date().getTime() - parseInt(lastSuccessfulEmailTime, 10);
            if (time < 60 * 1000) {
                global.head!.showAlert(false, "please do it after " + (60 - time / 1000) + " seconds");
                return;
            }
        }

        $.post(apiBaseUrl + "/api/tokens", {
            email: `${this.state!.emailHead}@${this.state!.emailTail}`,
            name: this.getName(),
            guid,
            code: this.state!.code,
            redirectUrl: this.state!.redirectUrl,
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success, please check your email.");
                window.localStorage.setItem(common.localStorageNames.lastSuccessfulEmailTime, new Date().getTime().toString());
            } else {
                global.head!.showAlert(false, data.errorMessage!);
                this.refreshCaptcha();
            }
        });
    },
    refreshCaptcha: function(this: Self) {
        $.post(apiBaseUrl + "/api/captchas", {
            id: guid,
        }).then((data: types.CaptchaResponse) => {
            if (data.status === 0) {
                this.setState!({ captchaUrl: data.url });
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    getName: function(this: Self) {
        if (this.state!.innerName) {
            return this.state!.innerName;
        }
        return this.state!.emailHead;
    },
    setRawEmail: function(this: Self, email: string) {
        if (common.isEmail(email)) {
            const tmp = email.trim().toLowerCase().split("@");
            this.setState!({
                emailHead: tmp[0],
                emailTail: tmp[1],
                innerRawEmail: email,
            });
        } else {
            this.setState!({
                emailHead: "",
                emailTail: "",
                innerRawEmail: email,
            });
        }
    },
    rawEmailChanged: function(this: Self, e: common.Event) {
        this.setRawEmail(e.target.value);
    },
    nameChanged: function(this: Self, e: common.Event) {
        const name: string = e.target.value;
        this.setState!({ innerName: name.trim() });
    },
    codeChanged: function(this: Self, e: common.Event) {
        this.setState!({ code: e.target.value });
    },
    componentWillUnmount: function() {
        global.authenticated = undefined;
        global.body = undefined;
    },
    getInitialState: function(this: Self) {
        global.body = this;
        global.authenticated = error => {
            if (error) {
                this.setRawEmail(window.localStorage.getItem(common.localStorageNames.lastLoginEmail));
                this.setState!({
                    innerName: window.localStorage.getItem(common.localStorageNames.lastLoginName),
                    redirectUrl: decodeURIComponent(common.getUrlParameter("redirect_url")!),
                });
                this.refreshCaptcha();
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
    render: function(this: Self) {
        let loginView: JSX.Element | undefined = undefined;
        if (this.state!.emailHead && this.state!.emailTail && this.state!.code && this.state!.requestCount === 0) {
            loginView = (
                <button type="button" className="btn btn-primary" onClick={this.login}>
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

        let captchaView: JSX.Element | undefined = undefined;
        if (this.state!.captchaUrl) {
            captchaView = (
                <div className="col-sm-2">
                    <img src={this.state!.captchaUrl}/>
                    <span className="glyphicon glyphicon-refresh pointer" aria-hidden="true" onClick={this.refreshCaptcha}></span>
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
                                            <input type="text" className="form-control" onChange={this.rawEmailChanged} value={this.state!.innerRawEmail}/>
                                        </div>

                                        <label className="col-sm-1 control-label">name:</label>

                                        <div className="col-sm-2">
                                            <input type="text" className="form-control" onChange={this.nameChanged} value={this.state!.innerName}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        {captchaView}
                                        <div className="col-sm-2">
                                            <input type="text" className="form-control" onChange={this.codeChanged} value={this.state!.code}/>
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
