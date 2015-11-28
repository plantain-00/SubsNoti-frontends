import * as base from "./base";
import * as common from "./common";
import * as types from "./types";

declare let Vue;

interface Organization {
    id: string;
    name: string;
}

interface OrganizationsResponse extends types.Response {
    organizations: Organization[];
}

interface VueBodyModel {
    email: string;
    organizationsCurrentUserCreated: Organization[];
    currentOrganizationId: string;

    canInvite: boolean;

    getOrganizationsCurrentUserCreated: () => void;
    invite: () => void;
}

let vueBody: VueBodyModel = new Vue({
    el: "#vue-body",
    data: {
        email: "",
        organizationsCurrentUserCreated: [],
        currentOrganizationId: "",
    },
    computed: {
        canInvite: function(): boolean {
            let self: VueBodyModel = this;

            return common.isEmail(self.email.trim()) && base.vueHead.requestCount === 0;
        },
    },
    methods: {
        getOrganizationsCurrentUserCreated: function() {
            let self: VueBodyModel = this;

            $.ajax({
                url: "/api/user/created",
                cache: false,
            }).then((data: OrganizationsResponse) => {
                if (data.isSuccess) {
                    self.organizationsCurrentUserCreated = data.organizations;
                    if (data.organizations.length > 0) {
                        let lastOrganizationId = window.localStorage.getItem(common.localStorageNames.lastOrganizationId);
                        if (lastOrganizationId && ~_.findIndex(data.organizations, o => o.id === lastOrganizationId)) {
                            self.currentOrganizationId = lastOrganizationId;
                        } else {
                            self.currentOrganizationId = data.organizations[0].id;
                        }
                    }
                } else {
                    base.vueHead.showAlert(false, data.errorMessage);
                }
            });
        },
        invite: function() {
            let self: VueBodyModel = this;

            $.post("/api/users/" + self.email + "/joined/" + self.currentOrganizationId, {}).then((data: types.Response) => {
                if (data.isSuccess) {
                    base.vueHead.showAlert(true, "success");
                } else {
                    base.vueHead.showAlert(false, data.errorMessage);
                }
            });
        },
        clickOrganization: function(organization: Organization) {
            let self: VueBodyModel = this;

            self.currentOrganizationId = organization.id;

            window.localStorage.setItem(common.localStorageNames.lastOrganizationId, organization.id);
        },
    },
});

$(document).ready(function() {
    base.vueHead.authenticate(error => {
        if (error) {
            console.log(error);
        }

        vueBody.getOrganizationsCurrentUserCreated();
    });
});
