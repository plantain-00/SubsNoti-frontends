import * as base from "./base";
import * as common from "./common";
import * as types from "./types";

declare let Vue;

interface VueBodyModel {
    allScopes: types.Scope[];
    scopes: string[];
    redirectUrl: string;
    code: string;
    application: types.Application;

    confirm: () => void;
}

let vueBody: VueBodyModel = new Vue({
    el: "#vue-body",
    data: {
        allScopes: [],
        scopes: [],
        redirectUrl: "",
        code: "",
        application: {
            creator: {}
        },
    },
    methods: {
        confirm: function() {
            let self: VueBodyModel = this;

            $.ajax({
                url: base.apiUrl + `/api/user/access_tokens/${self.code}`,
                method: "POST",
            }).then((data: types.Response) => {
                if (data.isSuccess) {
                    alert("success");
                    location.href = self.redirectUrl;
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
            return;
        }

        vueBody.redirectUrl = decodeURIComponent(common.getUrlParameter("redirect_url"));
        let scopes = decodeURIComponent(common.getUrlParameter("scopes"));
        vueBody.scopes = scopes.split(",");
        vueBody.code = decodeURIComponent(common.getUrlParameter("code"));

        let applicationId = common.getUrlParameter("application_id");
        if (applicationId) {
            $.ajax({
                url: base.apiUrl + `/api/applications/${decodeURIComponent(applicationId)}`
            }).then((data: types.ApplicationResponse) => {
                if (data.isSuccess) {
                    vueBody.application = data.application;
                } else {
                    base.vueHead.showAlert(false, data.errorMessage);
                }
            });
        }

        $.ajax({
            url: base.apiUrl + "/api/scopes"
        }).then((data: types.ScopesResponse) => {
            if (data.isSuccess) {
                vueBody.allScopes = data.scopes;
            } else {
                base.vueHead.showAlert(false, data.errorMessage);
            }
        });
    });
});
