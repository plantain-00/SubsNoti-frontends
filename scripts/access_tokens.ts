import * as base from "./base";
import * as common from "./common";
import * as types from "./types";

declare let Vue;

export interface AccessToken {
    id: string;
    description: string;
    scopes: types.Scope[];
}

export interface AccessTokensResponse extends types.Response {
    accessTokens: AccessToken[];
}

export interface AccessTokenResponse extends types.Response {
    accessToken: string;
}

interface VueBodyModel {
    accessTokens: AccessToken[];
    idInEditing: string;
    descriptionInEditing: string;
    scopes: types.Scope[];
    scopesInEditing: string[];
    newAccessToken: string;

    edit: (accessToken: AccessToken) => void;
    get: () => void;
    new: () => void;
    save: () => void;
    remove: () => void;
    regenerate: () => void;
}

let vueBody: VueBodyModel = new Vue({
    el: "#vue-body",
    data: {
        accessTokens: [],
        idInEditing: null,
        descriptionInEditing: "",
        scopes: [],
        scopesInEditing: [],
        newAccessToken: "",
    },
    methods: {
        edit: function(accessToken: AccessToken) {
            let self: VueBodyModel = this;

            self.idInEditing = accessToken.id;
            self.descriptionInEditing = accessToken.description;
            self.scopesInEditing = _.map(accessToken.scopes, a => a.name);
            self.newAccessToken = "";
        },
        get: function() {
            let self: VueBodyModel = this;

            $.ajax({
                url: base.apiUrl + "/api/user/access_tokens",
                cache: false,
            }).then((data: AccessTokensResponse) => {
                if (data.isSuccess) {
                    self.accessTokens = data.accessTokens;
                } else {
                    base.vueHead.showAlert(false, data.errorMessage);
                }
            });
        },
        new: function() {
            let self: VueBodyModel = this;

            self.idInEditing = null;
            self.descriptionInEditing = "";
            self.scopesInEditing = [];
            self.newAccessToken = "";
        },
        save: function() {
            let self: VueBodyModel = this;

            if (self.idInEditing) {
                $.ajax({
                    url: base.apiUrl + `/api/user/access_tokens/${self.idInEditing}`,
                    method: "PUT",
                    data: {
                        description: self.descriptionInEditing,
                        scopes: self.scopesInEditing,
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
                    url: base.apiUrl + "/api/user/access_tokens",
                    method: "POST",
                    data: {
                        description: self.descriptionInEditing,
                        scopes: self.scopesInEditing,
                    },
                }).then((data: AccessTokenResponse) => {
                    if (data.isSuccess) {
                        base.vueHead.showAlert(true, "success");
                        self.new();
                        self.get();
                        self.newAccessToken = data.accessToken;
                    } else {
                        base.vueHead.showAlert(false, data.errorMessage);
                    }
                });
            }
        },
        remove: function() {
            let self: VueBodyModel = this;

            $.ajax({
                url: base.apiUrl + `/api/user/access_tokens/${self.idInEditing}`,
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
        regenerate: function() {
            let self: VueBodyModel = this;

            $.ajax({
                url: base.apiUrl + `/api/user/access_tokens/${self.idInEditing}/value`,
                method: "PUT",
            }).then((data: AccessTokenResponse) => {
                if (data.isSuccess) {
                    base.vueHead.showAlert(true, "success");
                    self.new();
                    self.get();
                    self.newAccessToken = data.accessToken;
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

        $.ajax({
            url: base.apiUrl + "/api/scopes"
        }).then((data: types.ScopesResponse) => {
            if (data.isSuccess) {
                vueBody.scopes = data.scopes;
            } else {
                base.vueHead.showAlert(false, data.errorMessage);
            }
        });
    });
});
