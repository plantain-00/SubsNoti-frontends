/// <reference path="./common.d.ts" />

export function getUrlParameter(name: string): string | null {
    const reg: RegExp = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const array: RegExpMatchArray | null = window.location.search.substr(1).match(reg);
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
    loginResult: "loginResult",
};

export const localStorageNames = {
    lastSuccessfulEmailTime: "lastSuccessfulEmailTime",
    lastOrganizationId: "lastOrganizationId",
    lastLoginEmail: "lastLoginEmail",
    lastLoginName: "lastLoginName",
};

export const itemLimit = 10;
export const maxOrganizationNumberUserCanCreate = 3;

export function getFullUrl(avatar: string): string {
    return `${imageServerBaseUrl}/${avatar}`;
}

export function find<T>(array: T[], predicate: (t: T) => boolean) {
    for (const a of array) {
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

export const {match, RoutingContext, Route, Router, Link} = require("react-router");

export type Event = {
    target: {
        value: any,
        selectionStart: number,
        files: File[],
    },
    keyCode: number,
    dataTransfer: {
        files: File[],
    },
    preventDefault: () => void,
    stopPropagation: () => void;
    clipboardData: any,
    originalEvent: {
        clipboardData: any,
    }
};
