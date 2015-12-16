import * as base from "./base";
import * as common from "./common";
import * as types from "./types";

declare let Vue;

interface Scope {
    name: string;
    description: string;
}

interface Application {
    id: string;
    name: string;
    homeUrl: string;
    description: string;
    authorizationCallbackUrl?: string;
    clientId?: string;
    clientSecret?: string;
    creator?: types.User;
    scopes?: Scope[];
}

interface ApplicationsResponse extends types.Response {
    applications: Application[];
}

interface VueBodyModel {
    applications: Application[];
    idInEditing: string;
    nameInEditing: string;
    homeUrlInEditing: string;
    descriptionInEditing: string;
    authorizationCallbackUrlInEditing: string;
    clientSecretInEditing: string;

    show: (application: Application) => void;
    get: () => void;
    new: () => void;
    save: () => void;
    remove: () => void;
    resetClientSecret: () => void;
}

let vueBody: VueBodyModel = new Vue({
    el: "#vue-body",
    data: {
        applications: [],
        idInEditing: null,
        nameInEditing: "",
        homeUrlInEditing: "",
        descriptionInEditing: "",
        authorizationCallbackUrlInEditing: "",
        clientSecretInEditing: "",
    },
    methods: {
        edit: function(application: Application) {
            let self: VueBodyModel = this;

            self.idInEditing = application.id;
            self.nameInEditing = application.name;
            self.homeUrlInEditing = application.homeUrl;
            self.descriptionInEditing = application.description;
            self.authorizationCallbackUrlInEditing = application.authorizationCallbackUrl;
            self.clientSecretInEditing = application.clientSecret;
        },
        get: function() {
            let self: VueBodyModel = this;

            $.ajax({
                url: base.apiUrl + "/api/user/registered",
                cache: false,
            }).then((data: ApplicationsResponse) => {
                if (data.isSuccess) {
                    self.applications = data.applications;
                } else {
                    base.vueHead.showAlert(false, data.errorMessage);
                }
            });
        },
        new: function() {
            let self: VueBodyModel = this;

            self.idInEditing = null;
            self.nameInEditing = "";
            self.homeUrlInEditing = "";
            self.descriptionInEditing = "";
            self.authorizationCallbackUrlInEditing = "";
            self.clientSecretInEditing = "";
        },
        save: function() {
            let self: VueBodyModel = this;

            if (self.idInEditing) {
                $.ajax({
                    url: base.apiUrl + `/api/user/registered/${self.idInEditing}`,
                    method: "PUT",
                    data: {
                        name: self.nameInEditing,
                        homeUrl: self.homeUrlInEditing,
                        description: self.descriptionInEditing,
                        authorizationCallbackUrl: self.authorizationCallbackUrlInEditing,
                    },
                }).then((data: types.Response) => {
                    if (data.isSuccess) {
                        base.vueHead.showAlert(true, "success");
                        self.new();
                        self.get();
                    } else {
                        base.vueHead.showAlert(false, data.errorMessage);
                    }
                });
            } else {
                $.ajax({
                    url: base.apiUrl + "/api/user/registered",
                    method: "POST",
                    data: {
                        name: self.nameInEditing,
                        homeUrl: self.homeUrlInEditing,
                        description: self.descriptionInEditing,
                        authorizationCallbackUrl: self.authorizationCallbackUrlInEditing,
                    },
                }).then((data: types.Response) => {
                    if (data.isSuccess) {
                        base.vueHead.showAlert(true, "success");
                        self.new();
                        self.get();
                    } else {
                        base.vueHead.showAlert(false, data.errorMessage);
                    }
                });
            }
        },
        remove: function() {
            let self: VueBodyModel = this;

            $.ajax({
                url: base.apiUrl + `/api/user/registered/${self.idInEditing}`,
                method: "DELETE",
            }).then((data: types.Response) => {
                if (data.isSuccess) {
                    base.vueHead.showAlert(true, "success");
                    self.new();
                    self.get();
                } else {
                    base.vueHead.showAlert(false, data.errorMessage);
                }
            });
        },
        resetClientSecret: function() {
            let self: VueBodyModel = this;

            $.ajax({
                url: base.apiUrl + `/api/user/registered/${self.idInEditing}/client_secret`,
                method: "PUT",
            }).then((data: types.Response) => {
                if (data.isSuccess) {
                    base.vueHead.showAlert(true, "success");
                    self.new();
                    self.get();
                } else {
                    base.vueHead.showAlert(false, data.errorMessage);
                }
            });
        },
    },
});

$(document).ready(function() {
    base.vueHead.authenticate(error => {
        if (error) {
            console.log(error);
        }

        vueBody.get();
    });
});
