import * as base from "./base";
import * as common from "./common";
import * as types from "./types";

declare let Vue;

interface VueBodyModel {
    applications: types.Application[];
    application: types.Application;

    show: (application: types.Application) => void;
    get: () => void;
    revoke: (application: types.Application) => void;
}

let vueBody: VueBodyModel = new Vue({
    el: "#vue-body",
    data: {
        applications: [],
        application: null,
    },
    methods: {
        show: function(application: types.Application) {
            let self: VueBodyModel = this;

            self.application = application;
        },
        get: function() {
            let self: VueBodyModel = this;

            $.ajax({
                url: base.apiUrl + "/api/user/authorized",
                cache: false,
            }).then((data: types.ApplicationsResponse) => {
                if (data.isSuccess) {
                    for (let application of data.applications) {
                        application.lastUsed = application.lastUsed ? moment(application.lastUsed, moment.ISO_8601).fromNow() : "never used";
                    }
                    self.applications = data.applications;
                } else {
                    base.vueHead.showAlert(false, data.errorMessage);
                }
            });
        },
        revoke: function(application: types.Application) {
            let self: VueBodyModel = this;

            $.ajax({
                url: base.apiUrl + `/api/user/authorized/${application.id}`,
                method: "DELETE",
            }).then((data: types.Response) => {
                if (data.isSuccess) {
                    base.vueHead.showAlert(true, "success");
                    self.application = null;
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
