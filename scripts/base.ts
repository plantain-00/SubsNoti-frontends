declare let Vue;
declare let version: string;

import * as types from "./types";
import * as common from "./common";

Vue.config.debug = true;

interface CurrentUserResponse extends types.Response {
    user: types.User;
}

export let itemLimit = 10;
export let maxOrganizationNumberUserCanCreate = 3;

declare let imageServerBaseUrl: string;
declare let imageUploaderBaseUrl: string;
declare let apiBaseUrl: string;

export let imageServerUrl = imageServerBaseUrl;
export let imageUploaderUrl = imageUploaderBaseUrl;
export let apiUrl = apiBaseUrl;

export function getFullUrl(avatar: string): string {
    return `${imageServerUrl}/${avatar}`;
}

function getCurrentUser(next: (data: CurrentUserResponse) => void) {
    let loginResult = window.sessionStorage.getItem(common.sessionStorageNames.loginResult);

    if (loginResult) {
        let data: CurrentUserResponse = JSON.parse(loginResult);

        next(data);
    } else {
        $.ajax({
            url: apiUrl + "/api/user",
            cache: false,
        }).then((data: CurrentUserResponse) => {
            window.sessionStorage.setItem(common.sessionStorageNames.loginResult, JSON.stringify(data));

            next(data);
        });
    }
}

interface VueHeadModel {
    loginStatus: types.LoginStatus;
    currentUserId: string;
    currentUserName: string;
    currentUserEmail: string;
    currentAvatar: string;
    createdOrganizationCount: number;
    joinedOrganizationCount: number;
    requestCount: number;
    alertIsSuccess: boolean;
    showAlertMessage: boolean;
    alertMessage: string;

    canCreateOrganization: boolean;
    canInvite: boolean;

    showAlert: (isSuccess: boolean, message: string) => void;
    exit: () => void;
    authenticate: (next: (error: Error) => void) => void;
}

let timeoutId: number;

export let vueHead: VueHeadModel = new Vue({
    el: "#vue-head",
    data: {
        loginStatus: types.loginStatus.unknown,
        currentUserId: "",
        currentUserName: "",
        currentUserEmail: "",
        currentAvatar: "",
        createdOrganizationCount: maxOrganizationNumberUserCanCreate,
        joinedOrganizationCount: 0,
        requestCount: 0,
        alertIsSuccess: true,
        showAlertMessage: false,
        alertMessage: "",
    },
    computed: {
        canCreateOrganization: function() {
            let self: VueHeadModel = this;

            return self.createdOrganizationCount < maxOrganizationNumberUserCanCreate;
        },
        canInvite: function() {
            let self: VueHeadModel = this;

            return self.joinedOrganizationCount > 0;
        },
    },
    methods: {
        showAlert: function(isSuccess: boolean, message: string) {
            let self: VueHeadModel = this;

            self.alertIsSuccess = isSuccess;
            self.alertMessage = message;
            self.showAlertMessage = true;

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                self.showAlertMessage = false;
                timeoutId = null;
            }, 3000);
        },
        exit: function() {
            let self: VueHeadModel = this;

            $.ajax({
                type: "DELETE",
                url: apiUrl + "/api/user/logged_in",
                cache: false,
            }).then((data: CurrentUserResponse) => {
                if (data.isSuccess) {
                    self.loginStatus = types.loginStatus.fail;
                    self.currentUserId = "";
                    self.currentUserName = "";
                    self.currentUserEmail = "";
                    self.currentAvatar = "";
                    window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
                    self.createdOrganizationCount = maxOrganizationNumberUserCanCreate;
                    self.joinedOrganizationCount = 0;
                } else {
                    self.showAlert(false, data.errorMessage);
                }
            });
        },
        authenticate: function(next: (error: Error) => void) {
            let self: VueHeadModel = this;

            getCurrentUser(data => {
                if (data.isSuccess) {
                    self.loginStatus = types.loginStatus.success;
                    self.currentUserId = data.user.id;
                    self.currentUserName = data.user.name;
                    self.currentUserEmail = data.user.email;
                    self.currentAvatar = getFullUrl(data.user.avatar);
                    self.createdOrganizationCount = data.user.createdOrganizationCount;
                    self.joinedOrganizationCount = data.user.joinedOrganizationCount;

                    window.localStorage.setItem(common.localStorageNames.lastLoginEmail, data.user.email);
                    window.localStorage.setItem(common.localStorageNames.lastLoginName, data.user.name);

                    next(null);
                } else {
                    self.loginStatus = types.loginStatus.fail;
                    next(new Error(data.errorMessage));
                }
            });
        },
    },
});

$(document).ajaxSend(() => {
    vueHead.requestCount++;
}).ajaxComplete(() => {
    vueHead.requestCount--;
}).ajaxError(() => {
    vueHead.showAlert(false, "something happens unexpectedly, see console to get more details.");
});

$.ajaxSetup({
    headers: {
        "X-Version": version
    },
    xhrFields: {
        withCredentials: true
    },
});
