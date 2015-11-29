import * as base from "./base";
import * as common from "./common";
import * as types from "./types";

declare let Vue;

interface UploadResponse extends types.Response {
    names: string[];
}

interface VueBodyModel {
    name: string;

    canSave: boolean;

    save: () => void;
    update: (avatarFileName: string) => void;
}

let vueBody: VueBodyModel = new Vue({
    el: "#vue-body",
    data: {
        name: ""
    },
    computed: {
        canSave: function() {
            let self: VueBodyModel = this;

            return self.name.trim() !== "";
        },
    },
    methods: {
        save: function() {
            let self: VueBodyModel = this;

            let file = $(":file")[0]["files"][0];
            if (file) {
                let formData = new FormData();
                formData.append("file", file);

                $.ajax({
                    url: base.imageUploaderUrl + "/api/temperary",
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: "POST",
                }).then((data: UploadResponse) => {
                    if (data.isSuccess) {
                        let name = data.names[0];

                        self.update(name);
                    } else {
                        base.vueHead.showAlert(false, data.errorMessage);
                    }
                });
            } else {
                self.update(null);
            }
        },
        update: function(avatarFileName: string) {
            let self: VueBodyModel = this;

            if (self.name.trim() !== base.vueHead.currentUserName || avatarFileName) {
                $.ajax({
                    url: base.apiUrl + "/api/user",
                    data: {
                        name: self.name,
                        avatarFileName: avatarFileName,
                    },
                    cache: false,
                    type: "PUT",
                }).then((data: types.Response) => {
                    if (data.isSuccess) {
                        window.sessionStorage.removeItem(common.sessionStorageNames.loginResult);

                        base.vueHead.authenticate(error => {
                            if (error) {
                                console.log(error);
                            } else {
                                vueBody.name = base.vueHead.currentUserName;
                            }
                        });
                        base.vueHead.showAlert(true, "success");
                    } else {
                        base.vueHead.showAlert(false, data.errorMessage);
                    }
                });
            } else {
                base.vueHead.showAlert(false, "nothing changes.");
            }
        },
    },
});

$(document).ready(function() {
    base.vueHead.authenticate(error => {
        if (error) {
            console.log(error);
        } else {
            vueBody.name = base.vueHead.currentUserName;
        }
    });
});
