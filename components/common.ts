/// <reference path="./common.d.ts" />

export function getUrlParameter(name: string): string {
    let reg: RegExp = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let array: RegExpMatchArray = window.location.search.substr(1).match(reg);
    if (array && array.length >= 3) {
        return decodeURI(array[2]);
    }
    return null;
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

export function guid() {
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

export function isEmail(s: string): boolean {
    return /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(s);
}

export const sessionStorageNames = {
    loginResult: "loginResult"
};

export const localStorageNames = {
    lastSuccessfulEmailTime: "lastSuccessfulEmailTime",
    lastOrganizationId: "lastOrganizationId",
    lastLoginEmail: "lastLoginEmail",
    lastLoginName: "lastLoginName",
};

export let itemLimit = 10;
export let maxOrganizationNumberUserCanCreate = 3;

export function getFullUrl(avatar: string): string {
    return `${imageServerBaseUrl}/${avatar}`;
}

export function find<T>(array: T[], predicate: (t: T) => boolean) {
    for (let a of array) {
        if (predicate(a)) {
            return a;
        }
    }
    return null;
}

export function findIndex<T>(array: T[], predicate: (t: T) => boolean) {
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
}

import * as React from "react";
import * as ReactDOM from "react-dom";
export {React, ReactDOM};

export let History = require("history");
export let ReactRouter = require("react-router");
export let match = ReactRouter.match;
export let RouterContext = ReactRouter.RouterContext;
export let Route = ReactRouter.Route;
export let Router = ReactRouter.Router;
export let Link = ReactRouter.Link;
