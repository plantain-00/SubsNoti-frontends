export const enum StatusCode {
    OK = 200,
    createdOrModified = 201,
    accepted = 202,
    deleted = 204,
    invalidRequest = 400,
    unauthorized = 401,
    forbidden = 403,
    notFound = 404,
    notAcceptable = 406,
    gone = 410,
    unprocessableEntity = 422,
    tooManyRequest = 429,
    internalServerError = 500
}

function stringEnumify<T extends { [prop: string]: "" | string }>(obj: T) {
    return obj;
}

export type ThemeOrderType = "newest" | "recently updated";

export const themeOrder = stringEnumify({
    newest: "newest",
    recentlyUpdated: "recently updated",
});

export const enum ThemeStatus {
    open,
    closed
}

export type ThemeStatusType = "open" | "closed";

export const themeStatus = stringEnumify({
    open: "open",
    closed: "closed",
});

export interface CurrentUserResponse {
    id: string;
    email: string;
    name: string;
    createdOrganizationCount: number;
    joinedOrganizationCount: number;
    avatar: string;
}

export interface Response {
    isSuccess: boolean;
    statusCode: StatusCode;
    errorMessage?: string;
    stack?: string;
    documentUrl?: string;
    actualErrorMessage?: string;
}

export type PushEvent = "theme created" | "theme updated";

export const pushEvents = stringEnumify({
    themeCreated: "theme created",
    themeUpdated: "theme updated",
});

export interface User {
    id: string;
    name: string;
    email?: string;
    avatar: string;
    createdOrganizationCount?: number;
    joinedOrganizationCount?: number;
}

export interface Theme {
    id: string;
    title: string;
    detail: string;
    organizationId: string;
    createTime: string;
    updateTime?: string;
    status: ThemeStatusType;
    creator: User;
    owners: User[];
    watchers: User[];
}

export interface Scope {
    name: string;
    description: string;
}

export interface ScopesResponse extends Response {
    scopes: Scope[];
}

export interface Application {
    id: string;
    name: string;
    homeUrl: string;
    description: string;
    authorizationCallbackUrl?: string;
    clientId?: string;
    clientSecret?: string;
    creator?: User;
    scopes?: Scope[];
    lastUsed?: string;
}

export interface ApplicationsResponse extends Response {
    applications: Application[];
}

export interface ApplicationResponse extends Response {
    application: Application;
}

export type LoginStatus = "unknown" | "fail" | "success";

export const loginStatus = stringEnumify({
    unknown: "unknown",
    fail: "fail",
    success: "success",
});

export interface Organization {
    id: string;
    name: string;
}

export interface OrganizationsResponse extends Response {
    organizations: Organization[];
}

export interface Self<T> {
    state: T;
    setState: (state: T) => void;
}
