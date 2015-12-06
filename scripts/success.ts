import * as common from "./common";

let willClearPreviousStatus = common.getUrlParameter("clear_previous_status");

if (willClearPreviousStatus === common.yes) {
    window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);
}
