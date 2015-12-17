import * as common from "./common";

declare let Vue;

interface VueBodyModel {
    redirectUrl: string;
}

let vueBody: VueBodyModel = new Vue({
    el: "#vue-body",
    data: {
        redirectUrl: ""
    },
});


$(document).ready(function() {
    let willClearPreviousStatus = common.getUrlParameter("clear_previous_status");

    if (willClearPreviousStatus === common.yes) {
        window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
    }
    vueBody.redirectUrl = decodeURIComponent(common.getUrlParameter("redirect_url"));
});
