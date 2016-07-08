import * as types from "../share/types";
import { HeadComponent, global } from "./head";
import * as common from "./common";
import * as React from "react";

type Theme = types.Theme & {
    createTimeText?: string;
    updateTimeText?: string;
    isWatching?: boolean;
    isHovering?: boolean;
    watchersEmails?: string;
    ownersEmails?: string;
    isOwner?: boolean;
    expanded?: boolean;
    htmlDetail?: string;
    summaryDetail?: Summary;
    scrollTop?: number;
};

type State = {
    organizationsCurrentUserIn?: types.Organization[];
    currentOrganizationId?: string;
    themes?: Theme[];
    newThemeTitle?: string;
    newThemeDetail?: string;
    currentPage?: number;
    totalCount?: number;
    themeIdInEditing?: string;
    titleInEditing?: string;
    detailInEditing?: string;
    imageNamesInEditing?: string[];
    q?: string;
    isOpen?: boolean;
    isClosed?: boolean;
    showCreate?: boolean;
    order?: types.ThemeOrder;
    requestCount?: number;
};

type Self = types.Self<State> & {
    getOrganizationsCurrentUserIn: () => void;
    fetchThemes: (page: number, organizationId?: string) => void;
    initTheme: (theme: Theme) => void;
    clickOrganization: (organization: types.Organization) => void;
    createTheme: () => void;
    setThemeTimeText: () => void;
    watch: (theme: Theme) => void;
    unwatch: (theme: Theme) => void;
    close: (theme: Theme) => void;
    reopen: (theme: Theme) => void;
    getEmails: (users: types.User[]) => string;
    edit: (theme: Theme) => void;
    cancel: (theme: Theme) => void;
    save: (theme: Theme) => void;
    clickOpen: () => void;
    clickClosed: () => void;
    showMoreThemes: () => void;
    clickShowCreate: () => void;
    clickOrder: (order: types.ThemeOrder) => void;
    nextThemeCount: () => number;
    canShowMoreThemes: () => boolean;
    mouseEnterTheme: (theme: Theme) => void;
    mouseLeaveTheme: (theme: Theme) => void;
    newThemeTitleChanged: (e: common.Event) => void;
    newThemeDetailChanged: (e: common.Event) => void;
    qChanged: (e: common.Event) => void;
    titleInEditingChanged: (e: common.Event) => void;
    detailInEditingChanged: (e: common.Event) => void;
    qKeyUp: (e: common.Event) => void;
    onDragEnter: (e: common.Event) => void;
    onDragOver: (e: common.Event) => void;
    onDragLeave: (e: common.Event) => void;
    onDrop: (e: common.Event) => void;
    onImageUploaded: (e: common.Event) => void;
    uploadImage: (file: File, index?: number) => void;
    onPaste: (e: common.Event) => void;
    expand: (theme: Theme) => void;
    collapse: (theme: Theme) => void;
};

function changeOrganization(id: string) {
    socket.emit("change organization", {
        to: id,
    });
}

let intervalId: NodeJS.Timer;

let md: any;

type LinkTag = {
    href: string;
    content: string;
};

type Summary = {
    image: string | undefined;
    text: (LinkTag | string)[];
};

function replaceProtocal(src: string) {
    if (src.indexOf("http://") === 0 && src.indexOf("http://localhost") !== 0) {
        return "https://" + src.substring("http://".length);
    }
    return src;
}

function extractSummary(markdown: string): Summary {
    type Token = {
        tag: string;
        content: string;
        children: Token[];
        type: string;
        attrs: string[][];
    };
    const tokens: Token[] = md.parse(markdown, {});
    let image: string | undefined = undefined;
    const text: (LinkTag | string)[] = [];
    const maxSize = 80;
    let size = 0;

    function limitSize(content: string) {
        if (content.length > maxSize - size) {
            content = content.substr(0, maxSize - size) + "...";
            size = maxSize;
        }
        return content;
    }

    function pushText(content: string) {
        content = limitSize(content);
        if (text.length > 0 && typeof text[text.length - 1] === "string") {
            text[text.length - 1] += content;
        } else {
            text.push(content);
        }
    }

    for (const token of tokens) {
        if (size >= maxSize) {
            break;
        }
        if (token.tag === "") {
            if (token.children && token.children.length > 0
                && token.children[0].tag === "a"
                && token.children[0].attrs && token.children[0].attrs.length > 0
                && token.children[0].attrs[0].length > 1) {
                const content = limitSize(token.children[1].content);
                text.push({
                    content: content,
                    href: token.children[0].attrs[0][1],
                });
            } else if (token.children && token.children.length > 0
                && token.children[0].tag === "img"
                && token.children[0].attrs && token.children[0].attrs.length > 0
                && token.children[0].attrs[0].length > 1) {
                if (!image) {
                    image = token.children[0].attrs[0][1];
                    image = replaceProtocal(image);
                }
            } else {
                pushText(token.content);
            }
        } else if (token.tag === "code") {
            pushText(token.content);
        }
    }
    return { image, text };
}

const spec: Self = {
    getOrganizationsCurrentUserIn: function (this: Self) {
        $.ajax({
            url: apiBaseUrl + "/api/user/joined",
            cache: false,
        }).then((data: types.OrganizationsResponse) => {
            if (data.status === 0) {
                this.setState!({ organizationsCurrentUserIn: data.organizations });
                if (data.organizations.length > 0) {
                    const lastOrganizationId = window.localStorage.getItem(common.localStorageNames.lastOrganizationId);
                    if (lastOrganizationId && common.find(data.organizations, o => o.id === lastOrganizationId)) {
                        this.setState!({ currentOrganizationId: lastOrganizationId });
                    } else {
                        this.setState!({ currentOrganizationId: data.organizations[0].id });
                    }

                    changeOrganization(this.state!.currentOrganizationId!);

                    this.fetchThemes(1);
                }
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    getEmails: function (users: types.User[]) {
        return users.reduce((r, u) => r + u.email + ";", "");
    },
    fetchThemes: function (this: Self, page: number, organizationId?: string) {
        this.setState!({ currentPage: page });

        $.ajax({
            url: apiBaseUrl + "/api/organizations/" + (organizationId ? organizationId : this.state!.currentOrganizationId) + "/themes",
            data: {
                page,
                limit: common.itemLimit,
                q: this.state!.q,
                isOpen: this.state!.isOpen ? types.yes : types.no,
                isClosed: this.state!.isClosed ? types.yes : types.no,
                order: this.state!.order,
            },
            cache: false,
        }).then((data: types.ThemesResponse) => {
            if (data.status === 0) {
                for (const theme of data.themes) {
                    this.initTheme(theme);
                }
                if (page === 1) {
                    this.setState!({
                        themes: data.themes,
                        totalCount: data.totalCount,
                    });
                } else {
                    this.setState!({
                        themes: this.state!.themes!.concat(data.themes),
                        totalCount: data.totalCount,
                    });
                }
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    initTheme: function (this: Self, theme: Theme) {
        theme.isWatching = theme.watchers.some(w => w.id === global.head!.state!.currentUserId);
        theme.isOwner = theme.owners.some(o => o.id === global.head!.state!.currentUserId);
        theme.createTimeText = moment(theme.createTime, moment.ISO_8601).fromNow();
        if (theme.updateTime) {
            theme.updateTimeText = moment(theme.updateTime, moment.ISO_8601).fromNow();
        } else {
            theme.updateTimeText = theme.createTimeText;
        }
        theme.isHovering = false;
        theme.expanded = false;
        theme.watchersEmails = this.getEmails(theme.watchers);
        theme.ownersEmails = this.getEmails(theme.owners);
        theme.creator.avatar = common.getFullUrl(theme.creator.avatar);

        for (const watcher of theme.watchers) {
            watcher.avatar = common.getFullUrl(watcher.avatar);
        }

        for (const owner of theme.owners) {
            owner.avatar = common.getFullUrl(owner.avatar);
        }

        if (theme.detail) {
            theme.summaryDetail = extractSummary(theme.detail);
        }
    },
    clickOrganization: function (this: Self, organization: types.Organization) {
        if (this.state!.currentOrganizationId !== organization.id) {
            changeOrganization(organization.id);
        }

        this.setState!({ currentOrganizationId: organization.id });
        this.fetchThemes(1, organization.id);

        window.localStorage.setItem(common.localStorageNames.lastOrganizationId, organization.id);
    },
    createTheme: function (this: Self) {
        $.post(apiBaseUrl + "/api/themes", {
            themeTitle: this.state!.newThemeTitle,
            themeDetail: this.state!.newThemeDetail,
            organizationId: this.state!.currentOrganizationId,
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    setThemeTimeText: function (this: Self) {
        for (const theme of this.state!.themes!) {
            theme.createTimeText = moment(theme.createTime, moment.ISO_8601).fromNow();
            if (theme.updateTime) {
                theme.updateTimeText = moment(theme.updateTime, moment.ISO_8601).fromNow();
            } else {
                theme.updateTimeText = theme.createTimeText;
            }
        }
    },
    watch: function (theme: Theme) {
        $.ajax({
            url: apiBaseUrl + "/api/user/watched/" + theme.id,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    unwatch: function (theme: Theme) {
        $.ajax({
            url: apiBaseUrl + "/api/user/watched/" + theme.id,
            data: {},
            type: "DELETE",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    showMoreThemes: function (this: Self) {
        this.fetchThemes(this.state!.currentPage + 1);
    },
    close: function (theme: Theme) {
        $.ajax({
            url: apiBaseUrl + "/api/themes/" + theme.id,
            data: {
                status: types.themeStatus.closed,
            },
            cache: false,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    reopen: function (theme: Theme) {
        $.ajax({
            url: apiBaseUrl + "/api/themes/" + theme.id,
            data: {
                status: types.themeStatus.open,
            },
            cache: false,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    edit: function (this: Self, theme: Theme) {
        const themes = this.state!.themes;
        global.win!.scrollTop(theme.scrollTop!);
        this.setState!({
            themeIdInEditing: theme.id,
            titleInEditing: theme.title,
            detailInEditing: theme.detail,
            themes,
        });
    },
    cancel: function (this: Self, theme: Theme) {
        const themes = this.state!.themes;
        global.win!.scrollTop(theme.scrollTop!);
        this.setState!({
            themeIdInEditing: undefined,
            titleInEditing: "",
            detailInEditing: "",
            themes,
        });
    },
    save: function (this: Self, theme: Theme) {
        $.ajax({
            url: apiBaseUrl + "/api/themes/" + theme.id,
            data: {
                title: this.state!.titleInEditing,
                detail: this.state!.detailInEditing,
                imageNames: this.state!.imageNamesInEditing,
            },
            cache: false,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.status === 0) {
                global.head!.showAlert(true, "success");
                this.setState!({ imageNamesInEditing: [] });

                this.cancel(theme);
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    clickOpen: function (this: Self) {
        this.setState!({ isOpen: !this.state!.isOpen });
    },
    clickClosed: function (this: Self) {
        this.setState!({ isClosed: !this.state!.isClosed });
    },
    clickShowCreate: function (this: Self) {
        this.setState!({ showCreate: !this.state!.showCreate });
    },
    clickOrder: function (this: Self, order: types.ThemeOrder) {
        this.setState!({ order });
    },
    nextThemeCount: function (this: Self) {
        const count = this.state!.totalCount - common.itemLimit * this.state!.currentPage;
        return count > common.itemLimit ? common.itemLimit : count;
    },
    canShowMoreThemes: function (this: Self) {
        return this.nextThemeCount() > 0 && this.state!.requestCount === 0;
    },
    mouseEnterTheme: function (this: Self, theme: Theme) {
        const themes = this.state!.themes;
        theme.isHovering = true;
        this.setState!({ themes });
    },
    mouseLeaveTheme: function (this: Self, theme: Theme) {
        const themes = this.state!.themes;
        theme.isHovering = false;
        this.setState!({ themes });
    },
    newThemeTitleChanged: function (this: Self, e: common.Event) {
        this.setState!({ newThemeTitle: e.target.value });
    },
    newThemeDetailChanged: function (this: Self, e: common.Event) {
        this.setState!({ newThemeDetail: e.target.value });
    },
    qChanged: function (this: Self, e: common.Event) {
        this.setState!({ q: e.target.value });
    },
    titleInEditingChanged: function (this: Self, e: common.Event) {
        this.setState!({ titleInEditing: e.target.value });
    },
    detailInEditingChanged: function (this: Self, e: common.Event) {
        this.setState!({ detailInEditing: e.target.value });
    },
    qKeyUp: function (this: Self, e: common.Event) {
        if (e.keyCode === 13) {
            this.fetchThemes(1);
        }
    },
    onDragEnter: function (e: common.Event) {
        const file = e.dataTransfer.files[0];
        if (file) {
            e.preventDefault();
        }
    },
    onDragOver: function (e: common.Event) {
        const file = e.dataTransfer.files[0];
        if (file) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    },
    onDragLeave: function (e: common.Event) {
        const file = e.dataTransfer.files[0];
        if (file) {
            e.preventDefault();
        }
    },
    onDrop: function (this: Self, e: common.Event) {
        const file = e.dataTransfer.files[0];
        if (file) {
            e.preventDefault();
            this.uploadImage(file, e.target.selectionStart);
        }
    },
    onPaste: function (this: Self, e: common.Event) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        if (items.length > 0) {
            for (const item of items) {
                if (item.type.indexOf("image") === 0) {
                    const file = item.getAsFile();
                    e.preventDefault();
                    this.uploadImage(file, e.target.selectionStart);
                    break;
                }
            }
        }
    },
    onImageUploaded: function (this: Self, e: common.Event) {
        const file = e.target.files[0];
        if (file) {
            e.preventDefault();
            this.uploadImage(file);
        }
    },
    uploadImage: function (this: Self, file: File, index?: number) {
        const formData = new FormData();
        formData.append("file", file);

        $.ajax({
            url: imageUploaderBaseUrl + "/api/temperary",
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
        }).then((data: types.TemperaryResponse) => {
            if (data.status === 0) {
                const name = data.names[0];
                const names = this.state!.imageNamesInEditing;
                names!.push(name);
                this.setState!({ imageNamesInEditing: names });
                let head: string;
                let tail: string;
                if (index) {
                    head = this.state!.detailInEditing!.substring(0, index);
                    tail = this.state!.detailInEditing!.substring(index);
                } else {
                    head = this.state!.detailInEditing!;
                    tail = "";
                }
                const result = `${head}![](${imageServerBaseUrl}/${name})${tail}`;
                this.setState!({ detailInEditing: result });
            } else {
                global.head!.showAlert(false, data.errorMessage!);
            }
        });
    },
    expand: function (this: Self, theme: Theme) {
        const themes = this.state!.themes;
        theme.expanded = true;
        theme.scrollTop = global.win!.scrollTop();
        this.setState!({ themes });
    },
    collapse: function (this: Self, theme: Theme) {
        const themes = this.state!.themes;
        theme.expanded = false;
        global.win!.scrollTop(theme.scrollTop!);
        this.setState!({ themes });
    },
    componentDidMount: function (this: Self) {
        global.body = this;
        this.getOrganizationsCurrentUserIn();
        intervalId = setInterval(this.setThemeTimeText, 10000);

        global.themeCreated = (theme: Theme) => {
            if (theme.organizationId === this.state!.currentOrganizationId) {
                this.initTheme(theme);
                this.setState!({ themes: [theme].concat(this.state!.themes!) });
            }
        };

        global.themeUpdated = (theme: Theme) => {
            if (theme.organizationId === this.state!.currentOrganizationId) {
                const index = common.findIndex(this.state!.themes!, t => t.id === theme.id);
                if (index > -1) {
                    this.initTheme(theme);
                    const themes = this.state!.themes;
                    theme.expanded = themes![index].expanded;
                    theme.scrollTop = themes![index].scrollTop;
                    themes![index] = theme;
                    this.setState!({ themes });
                }
            }
        };

        global.scrolled = () => {
            if (this.canShowMoreThemes()) {
                this.showMoreThemes();
            }
        };

        md = markdownit({
            linkify: true,
            highlight: function (str: string, lang: string) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (error) {
                        console.log(error);
                    }
                }

                try {
                    return hljs.highlightAuto(str).value;
                } catch (error) {
                    console.log(error);
                }

                return "";
            },
        });

        const defaultImageRender = md.renderer.rules.image;
        md.renderer.rules.image = function (tokens: any, index: number, options: any, env: any, s: any) {
            const token = tokens[index];
            const aIndex = token.attrIndex("src");

            token.attrs[aIndex][1] = replaceProtocal(token.attrs[aIndex][1]);
            token.attrPush(["class", "theme-detail-image"]);

            return defaultImageRender(tokens, index, options, env, s);
        };

        const defaultLinkRender = md.renderer.rules.link_open || function (tokens: any, index: number, options: any, env: any, s: any) {
            return s.renderToken(tokens, index, options);
        };
        md.renderer.rules.link_open = function (tokens: any, index: number, options: any, env: any, s: any) {
            tokens[index].attrPush(["target", "_blank"]);
            tokens[index].attrPush(["rel", "nofollow"]);
            return defaultLinkRender(tokens, index, options, env, s);
        };
    },
    componentWillUnmount: function () {
        global.body = undefined;
        if (intervalId) {
            clearInterval(intervalId);
        }
        global.themeCreated = undefined;
        global.themeUpdated = undefined;
        global.scrolled = undefined;
        md = undefined;
    },
    getInitialState: function () {
        return {
            organizationsCurrentUserIn: [],
            currentOrganizationId: "",
            themes: [],
            newThemeTitle: "",
            newThemeDetail: "",
            currentPage: 1,
            totalCount: 0,
            themeIdInEditing: undefined,
            titleInEditing: "",
            detailInEditing: "",
            imageNamesInEditing: [],
            q: "",
            isOpen: true,
            isClosed: false,
            showCreate: false,
            order: types.themeOrder.newest,
            requestCount: 0,
        } as State;
    },
    render: function (this: Self) {
        const canSave = this.state!.titleInEditing!.trim() && this.state!.requestCount === 0;

        let showMoreThemesView: JSX.Element | undefined = undefined;
        if (this.canShowMoreThemes()) {
            showMoreThemesView = (
                <button type="button" className="btn btn-primary btn-lg col-sm-12" onClick={this.showMoreThemes}>
                    show {this.nextThemeCount()} more {this.nextThemeCount() > 1 ? "themes" : "theme"}(total {this.state!.totalCount})
                </button>
            );
        } else {
            showMoreThemesView = (
                <button type="button" className="btn btn-primary btn-lg col-sm-12" disabled>
                    total {this.state!.totalCount}
                </button>
            );
        }

        const themesView = this.state!.themes!.map(theme => {
            let themeTitleView: JSX.Element | undefined = undefined;
            let themeDetailView: JSX.Element | undefined = undefined;
            if (this.state!.themeIdInEditing !== theme.id) {
                themeTitleView = (
                    <span>
                        {theme.title}
                        <span className={"theme-title-status label label-" + (theme.status === types.themeStatus.open ? "success" : "danger")}>{theme.status}</span>
                    </span>
                );
                if (theme.detail) {
                    if (theme.expanded) {
                        if (!theme.htmlDetail) {
                            theme.htmlDetail = md.render(theme.detail);
                        }
                        themeDetailView = (
                            <div dangerouslySetInnerHTML={{ __html: theme.htmlDetail }}></div>
                        );
                    } else {
                        let imageView: JSX.Element | undefined = undefined;
                        const textView = theme.summaryDetail!.text.map((t, i) => {
                            if (typeof t === "string") {
                                return (
                                    <span key={i}>{t}</span>
                                );
                            } else {
                                return (
                                    <a key={i} href={t.href} target="_blank" rel="nofollow">{t.content}</a>
                                );
                            }
                        });
                        if (theme.summaryDetail!.image) {
                            imageView = (
                                <img src={theme.summaryDetail!.image} className="float-left theme-head-image"/>
                            );
                        }
                        themeDetailView = (
                            <div onClick={this.expand.bind(this, theme)} className="clearfix pointer">
                                {imageView}
                                {textView}
                            </div>
                        );
                    }
                }
            } else {
                themeTitleView = (
                    <input className="form-control" onChange={this.titleInEditingChanged} value={this.state!.titleInEditing}/>
                );
                themeDetailView = (
                    <textarea rows={10} className="form-control" onDragEnter={this.onDragEnter} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop} onPaste={this.onPaste} onChange={this.detailInEditingChanged} value={this.state!.detailInEditing}></textarea>
                );
            }

            let ownersView: JSX.Element | undefined = undefined;
            if (theme.owners.length > 0) {
                ownersView = (
                    <button type="button" className="clip btn btn-xs btn-link" data-clipboard-text={theme.ownersEmails}>
                        {theme.owners.length} {theme.owners.length > 1 ? "owners" : "owner"}
                    </button>
                );
            } else {
                ownersView = (
                    <span>no owner</span>
                );
            }

            let watchersView: JSX.Element | undefined = undefined;
            if (theme.watchers.length > 0) {
                watchersView = (
                    <button type="button" className="clip btn btn-xs btn-link" data-clipboard-text={theme.watchersEmails}>
                        {theme.watchers.length} {theme.watchers.length > 1 ? "watchers" : "watcher"}
                    </button>
                );
            } else {
                watchersView = (
                    <span>no watcher</span>
                );
            }

            let watchButton: JSX.Element | undefined = undefined;
            if (theme.isWatching) {
                watchButton = (
                    <button type="button" className="btn btn-xs btn-link" onClick={this.unwatch.bind(this, theme)}>
                        unwatch
                    </button>
                );
            } else {
                watchButton = (
                    <button type="button" className="btn btn-xs btn-link" onClick={this.watch.bind(this, theme)}>
                        watch
                    </button>
                );
            }

            let hoveringView: JSX.Element | undefined = undefined;
            if (theme.isHovering || theme.expanded || this.state!.themeIdInEditing === theme.id) {
                let ownerView: JSX.Element | undefined = undefined;
                if (theme.isOwner) {
                    let openButton: JSX.Element | undefined = undefined;
                    if (theme.status === "open") {
                        openButton = (
                            <button type="button" className="btn btn-xs btn-link" onClick={this.close.bind(this, theme)}>
                                close
                            </button>
                        );
                    } else {
                        openButton = (
                            <button type="button" className="btn btn-xs btn-link" onClick={this.reopen.bind(this, theme)}>
                                reopen
                            </button>
                        );
                    }

                    let cancelButton: JSX.Element | undefined = undefined;
                    let editButton: JSX.Element | undefined = undefined;
                    let saveButton: JSX.Element | undefined = undefined;
                    let uploadButton: JSX.Element | undefined = undefined;
                    if (this.state!.themeIdInEditing !== null) {
                        if (this.state!.themeIdInEditing === theme.id) {
                            cancelButton = (
                                <div className="inline">
                                    •
                                    <button type="button" className="btn btn-xs btn-link"
                                        onClick={this.cancel.bind(this, theme)}>
                                        cancel
                                    </button>
                                </div>
                            );
                            if (canSave && (this.state!.titleInEditing !== theme.title || this.state!.detailInEditing !== theme.detail)) {
                                saveButton = (
                                    <div className="inline">
                                        •
                                        <button type="button" className="btn btn-xs btn-link"
                                            onClick={this.save.bind(this, theme)}>
                                            save
                                        </button>
                                    </div>
                                );
                            }
                            uploadButton = (
                                <div className="inline">
                                    •
                                    <button type="button" className="btn btn-xs btn-link relative">
                                        <span className="pointer">upload image</span>
                                        <input type="file" accept="image/*" onChange={this.onImageUploaded} className="theme-image-chooser"/>
                                    </button>
                                </div>
                            );
                        }
                    } else {
                        editButton = (
                            <div className="inline">
                                •
                                <button type="button" className="btn btn-xs btn-link"
                                    onClick={this.edit.bind(this, theme)}>
                                    edit
                                </button>
                            </div>
                        );
                    }
                    ownerView = (
                        <div className="inline">
                            •
                            {openButton}
                            {editButton}
                            {saveButton}
                            {cancelButton}
                            {uploadButton}
                        </div>
                    );
                }
                let collapseButton: JSX.Element | undefined = undefined;
                if (theme.expanded) {
                    collapseButton = (
                        <div className="inline">
                            •
                            <button type="button" className="btn btn-xs btn-link"
                                onClick={this.collapse.bind(this, theme)}>
                                collapse
                            </button>
                        </div>
                    );
                }
                hoveringView = (
                    <div className="inline">
                        •
                        {watchButton}
                        {ownerView}
                        {collapseButton}
                    </div>
                );
            }

            return (
                <tr key={theme.id} onMouseEnter={this.mouseEnterTheme.bind(this, theme)} onMouseLeave={this.mouseLeaveTheme.bind(this, theme)}>
                    <td className="theme-creator-avatar">
                        <img src={theme.creator.avatar} height="50" width="50"/>
                    </td>
                    <td>
                        <h5>
                            {themeTitleView}
                        </h5>
                        <div>
                            {themeDetailView}
                        </div>
                        <div className="theme-buttons">
                            <button type="button" className="clip btn btn-xs btn-link" data-clipboard-text={theme.creator.email}>
                                {theme.creator.name}
                            </button>
                            •
                            created {theme.createTimeText}
                            <div style={{ display: theme.updateTimeText ? "inline" : "none" }}>
                                •
                                updated {theme.updateTimeText}
                            </div>
                            •
                            {ownersView}
                            •
                            {watchersView}
                            {hoveringView}
                        </div>
                    </td>
               </tr>
            );
        });

        const organizationsView = this.state!.organizationsCurrentUserIn!.map(organization => {
            return (
                <label key={organization.id} className={ "the-label " + (this.state!.currentOrganizationId === organization.id ? "label-active" : "") }
                    onClick={this.clickOrganization.bind(this, organization)}>
                    {organization.name}
                </label>
            );
        });

        let currentOrganizationView: JSX.Element | undefined = undefined;
        if (this.state!.currentOrganizationId !== "") {
            let createButton: JSX.Element | undefined = undefined;
            if (this.state!.newThemeTitle!.trim() && this.state!.requestCount === 0) {
                createButton = (
                    <button type="button" className="btn btn-primary" onClick={this.createTheme}>Create</button>
                );
            } else {
                createButton = (
                    <button type="button" className="btn btn-primary" disabled>Please input title</button>
                );
            }

            const showCreateView = (
                <span className={ "theme-add btn btn-primary glyphicon glyphicon-" + (this.state!.showCreate ? "minus" : "plus") } aria-hidden="true" onClick={this.clickShowCreate}></span>
            );

            let newThemeTitleView: JSX.Element | undefined = undefined;
            let newThemeDetailView: JSX.Element | undefined = undefined;
            let createButtonView: JSX.Element | undefined = undefined;
            if (this.state!.showCreate) {
                newThemeTitleView = (
                    <div className="form-group">
                        <label className="col-sm-2 control-label">title</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" onChange={this.newThemeTitleChanged} value={this.state!.newThemeTitle}/>
                        </div>
                    </div>
                );
                newThemeDetailView = (
                    <div className="form-group">
                        <label className="col-sm-2 control-label">detail</label>
                        <div className="col-sm-10">
                            <textarea className="form-control" rows={10} onChange={this.newThemeDetailChanged} value={this.state!.newThemeDetail}></textarea>
                        </div>
                    </div>
                );
                createButtonView = (
                    <div className="form-group">
                        <div className="col-sm-10 col-sm-offset-2">
                            {createButton}
                        </div>
                    </div>
                );
            }

            currentOrganizationView = (
                <form className="form-horizontal">
                    <div className="form-group">
                        <div className="col-sm-12">
                            {organizationsView}
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-4">
                            <input className="form-control" onChange={this.qChanged} value={this.state!.q} onKeyUp={this.qKeyUp}/>
                        </div>
                        <div className="col-sm-8">
                            <label className={ "the-label " + (this.state!.isOpen ? "label-active" : "") } onClick={this.clickOpen}>
                                open
                            </label>
                            <label className={ "the-label " + (this.state!.isClosed ? "label-active" : "") } onClick={this.clickClosed}>
                                closed
                            </label>
                            order by
                            <label className={ "the-label " + (this.state!.order === "newest" ? "label-active" : "") } onClick={this.clickOrder.bind(this, "newest")}>
                                newest
                            </label>
                            <label className={ "the-label " + (this.state!.order === "recently updated" ? "label-active" : "") } onClick={this.clickOrder.bind(this, "recently updated")}>
                                recently updated
                            </label>
                            <span className="glyphicon glyphicon-search btn btn-primary" aria-hidden="true" onClick={this.fetchThemes.bind(this, 1, undefined)}></span>
                            {showCreateView}
                        </div>
                    </div>
                    {newThemeTitleView}
                    {newThemeDetailView}
                    {createButtonView}
                    <div className="form-group">
                        <div className="col-sm-12">
                            <table className="table">
                                <tbody>
                                    {themesView}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-sm-12">
                            {showMoreThemesView}
                        </div>
                    </div>
                </form>
            );
        }

        return (
            <div>
                <HeadComponent/>
                <div className="container body-container">
                    <div className="row">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                Themes
                            </div>
                            <div className="panel-body">
                                {currentOrganizationView}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

export const ThemesComponent = React.createClass(spec);
