import * as types from "../share/types";
import {HeadComponent, global} from "./head";
import * as common from "./common";
import * as React from "react";

interface Theme extends types.Theme {
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
}

interface State {
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
}

interface Self extends types.Self<State> {
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
    newThemeTitleChanged: (e) => void;
    newThemeDetailChanged: (e) => void;
    qChanged: (e) => void;
    titleInEditingChanged: (e) => void;
    detailInEditingChanged: (e) => void;
    qKeyUp: (e) => void;
    onDragEnter: (e) => void;
    onDragOver: (e) => void;
    onDragLeave: (e) => void;
    onDrop: (e) => void;
    onImageUploaded: (e) => void;
    uploadImage: (file, index?: number) => void;
    onPaste: (e) => void;
    expand: (theme: Theme) => void;
    collapse: (theme: Theme) => void;
}

function changeOrganization(id) {
    socket.emit("change organization", {
        to: id
    });
}

let intervalId;

let md;

interface LinkTag {
    href: string;
    content: string;
}

interface Summary {
    image: string;
    text: (LinkTag | string) [];
}

function replaceProtocal(src: string) {
    if (src.indexOf("http://") === 0 && src.indexOf("http://localhost") !== 0) {
        return "https://" + src.substring("http://".length);
    }
    return src;
}

function extractSummary(markdown: string): Summary {
    interface Token {
        tag: string;
        content: string;
        children: Token[];
        type: string;
        attrs: string[][];
    }
    let tokens: Token[] = md.parse(markdown, {});
    let image = undefined;
    let text: (LinkTag | string) [] = [];
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

    for (let token of tokens) {
        if (size >= maxSize) {
            break;
        }
        if (token.tag === "") {
            if (token.children && token.children.length > 0
                && token.children[0].tag === "a"
                && token.children[0].attrs && token.children[0].attrs.length > 0
                && token.children[0].attrs[0].length > 1) {
                let content = limitSize(token.children[1].content);
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
    return {
        image: image,
        text: text,
    };
}

let spec: Self = {
    getOrganizationsCurrentUserIn: function() {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + "/api/user/joined",
            cache: false,
        }).then((data: types.OrganizationsResponse) => {
            if (data.isSuccess) {
                self.setState({ organizationsCurrentUserIn: data.organizations });
                if (data.organizations.length > 0) {
                    let lastOrganizationId = window.localStorage.getItem(common.localStorageNames.lastOrganizationId);
                    if (lastOrganizationId && common.find(data.organizations, o => o.id === lastOrganizationId)) {
                        self.setState({ currentOrganizationId: lastOrganizationId });
                    } else {
                        self.setState({ currentOrganizationId: data.organizations[0].id });
                    }

                    changeOrganization(self.state.currentOrganizationId);

                    self.fetchThemes(1);
                }
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    getEmails: function(users: types.User[]) {
        return users.reduce((r, u) => r + u.email + ";", "");
    },
    fetchThemes: function(page: number, organizationId?: string) {
        let self: Self = this;

        self.setState({ currentPage: page });

        $.ajax({
            url: apiBaseUrl + "/api/organizations/" + (organizationId ? organizationId : self.state.currentOrganizationId) + "/themes",
            data: {
                page: page,
                limit: common.itemLimit,
                q: self.state.q,
                isOpen: self.state.isOpen ? types.yes : types.no,
                isClosed: self.state.isClosed ? types.yes : types.no,
                order: self.state.order,
            },
            cache: false,
        }).then((data: types.ThemesResponse) => {
            if (data.isSuccess) {
                for (let theme of data.themes) {
                    self.initTheme(theme);
                }
                if (page === 1) {
                    self.setState({
                        themes : data.themes,
                        totalCount: data.totalCount,
                    });
                } else {
                    self.setState({
                        themes : self.state.themes.concat(data.themes),
                        totalCount: data.totalCount,
                    });
                }
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    initTheme: function(theme: Theme) {
        let self: Self = this;

        theme.isWatching = theme.watchers.some(w => w.id === global.head.state.currentUserId);
        theme.isOwner = theme.owners.some(o => o.id === global.head.state.currentUserId);
        theme.createTimeText = moment(theme.createTime, moment.ISO_8601).fromNow();
        if (theme.updateTime) {
            theme.updateTimeText = moment(theme.updateTime, moment.ISO_8601).fromNow();
        } else {
            theme.updateTimeText = theme.createTimeText;
        }
        theme.isHovering = false;
        theme.expanded = false;
        theme.watchersEmails = self.getEmails(theme.watchers);
        theme.ownersEmails = self.getEmails(theme.owners);
        theme.creator.avatar = common.getFullUrl(theme.creator.avatar);

        for (let watcher of theme.watchers) {
            watcher.avatar = common.getFullUrl(watcher.avatar);
        }

        for (let owner of theme.owners) {
            owner.avatar = common.getFullUrl(owner.avatar);
        }

        if (theme.detail) {
            theme.summaryDetail = extractSummary(theme.detail);
        }
    },
    clickOrganization: function(organization: types.Organization) {
        let self: Self = this;

        if (self.state.currentOrganizationId !== organization.id) {
            changeOrganization(organization.id);
        }

        self.setState({ currentOrganizationId: organization.id });
        self.fetchThemes(1, organization.id);

        window.localStorage.setItem(common.localStorageNames.lastOrganizationId, organization.id);
    },
    createTheme: function() {
        let self: Self = this;

        $.post(apiBaseUrl + "/api/themes", {
            themeTitle: self.state.newThemeTitle,
            themeDetail: self.state.newThemeDetail,
            organizationId: self.state.currentOrganizationId,
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success");
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    setThemeTimeText: function() {
        let self: Self = this;

        for (let theme of self.state.themes) {
            theme.createTimeText = moment(theme.createTime, moment.ISO_8601).fromNow();
            if (theme.updateTime) {
                theme.updateTimeText = moment(theme.updateTime, moment.ISO_8601).fromNow();
            } else {
                theme.updateTimeText = theme.createTimeText;
            }
        }
    },
    watch: function(theme: Theme) {
        $.ajax({
            url: apiBaseUrl + "/api/user/watched/" + theme.id,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success");
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    unwatch: function(theme: Theme) {
        $.ajax({
            url: apiBaseUrl + "/api/user/watched/" + theme.id,
            data: {},
            type: "DELETE",
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success");
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    showMoreThemes: function() {
        let self: Self = this;

        self.fetchThemes(self.state.currentPage + 1);
    },
    close: function(theme: Theme) {
        $.ajax({
            url: apiBaseUrl + "/api/themes/" + theme.id,
            data: {
                status: types.themeStatus.closed
            },
            cache: false,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success");
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    reopen: function(theme: Theme) {
        $.ajax({
            url: apiBaseUrl + "/api/themes/" + theme.id,
            data: {
                status: types.themeStatus.open
            },
            cache: false,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success");
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    edit: function(theme: Theme) {
        let self: Self = this;

        let themes = self.state.themes;
        global.win.scrollTop(theme.scrollTop);
        self.setState({
            themeIdInEditing: theme.id,
            titleInEditing: theme.title,
            detailInEditing: theme.detail,
            themes: themes,
        });
    },
    cancel: function(theme: Theme) {
        let self: Self = this;

        let themes = self.state.themes;
        global.win.scrollTop(theme.scrollTop);
        self.setState({
            themeIdInEditing: null,
            titleInEditing: "",
            detailInEditing: "",
            themes: themes,
        });
    },
    save: function(theme: Theme) {
        let self: Self = this;

        $.ajax({
            url: apiBaseUrl + "/api/themes/" + theme.id,
            data: {
                title: self.state.titleInEditing,
                detail: self.state.detailInEditing,
                imageNames: self.state.imageNamesInEditing,
            },
            cache: false,
            type: "PUT",
        }).then((data: types.Response) => {
            if (data.isSuccess) {
                global.head.showAlert(true, "success");
                self.setState({ imageNamesInEditing: [] });

                self.cancel(theme);
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    clickOpen: function() {
        let self: Self = this;

        self.setState({ isOpen: !self.state.isOpen });
    },
    clickClosed: function() {
        let self: Self = this;

        self.setState({ isClosed: !self.state.isClosed });
    },
    clickShowCreate: function() {
        let self: Self = this;

        self.setState({ showCreate: !self.state.showCreate });
    },
    clickOrder: function(order: types.ThemeOrder) {
        let self: Self = this;

        self.setState({ order: order });
    },
    nextThemeCount: function() {
        let self: Self = this;

        let count = self.state.totalCount - common.itemLimit * self.state.currentPage;
        return count > common.itemLimit ? common.itemLimit : count;
    },
    canShowMoreThemes: function() {
        let self: Self = this;

        return self.nextThemeCount() > 0 && self.state.requestCount === 0;
    },
    mouseEnterTheme: function(theme: Theme) {
        let self: Self = this;

        let themes = self.state.themes;
        theme.isHovering = true;
        self.setState({ themes: themes });
    },
    mouseLeaveTheme: function(theme: Theme) {
        let self: Self = this;

        let themes = self.state.themes;
        theme.isHovering = false;
        self.setState({ themes: themes });
    },
    newThemeTitleChanged: function(e) {
        let self: Self = this;

        self.setState({ newThemeTitle: e.target.value });
    },
    newThemeDetailChanged: function(e) {
        let self: Self = this;

        self.setState({ newThemeDetail: e.target.value });
    },
    qChanged: function(e) {
        let self: Self = this;

        self.setState({ q: e.target.value });
    },
    titleInEditingChanged: function(e) {
        let self: Self = this;

        self.setState({ titleInEditing: e.target.value });
    },
    detailInEditingChanged: function(e) {
        let self: Self = this;

        self.setState({ detailInEditing: e.target.value });
    },
    qKeyUp: function(e) {
        let self: Self = this;

        if (e.keyCode === 13) {
            self.fetchThemes(1);
        }
    },
    onDragEnter: function(e) {
        let file = e.dataTransfer.files[0];
        if (file) {
            e.preventDefault();
        }
    },
    onDragOver: function(e) {
        let file = e.dataTransfer.files[0];
        if (file) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    },
    onDragLeave: function(e) {
        let file = e.dataTransfer.files[0];
        if (file) {
            e.preventDefault();
        }
    },
    onDrop: function(e) {
        let self: Self = this;

        let file = e.dataTransfer.files[0];
        if (file) {
            e.preventDefault();
            self.uploadImage(file, e.target.selectionStart);
        }
    },
    onPaste: function(e) {
        let self: Self = this;

        let items = (e.clipboardData  || e.originalEvent.clipboardData).items;
        if (items.length > 0) {
            let file;
            for (let item of items) {
                if (item.type.indexOf("image") === 0) {
                    file = item.getAsFile();
                }
            }
            if (file) {
                e.preventDefault();
                self.uploadImage(file, e.target.selectionStart);
            }
        }
    },
    onImageUploaded: function(e) {
        let self: Self = this;

        let file = e.target.files[0];
        if (file) {
            e.preventDefault();
            self.uploadImage(file);
        }
    },
    uploadImage: function(file, index?: number) {
        let self: Self = this;

        let formData = new FormData();
        formData.append("file", file);

        $.ajax({
            url: imageUploaderBaseUrl + "/api/temperary",
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
        }).then((data: types.TemperaryResponse) => {
            if (data.isSuccess) {
                let name = data.names[0];
                let names = self.state.imageNamesInEditing;
                names.push(name);
                self.setState({ imageNamesInEditing: names });
                let head;
                let tail;
                if (index) {
                    head = self.state.detailInEditing.substring(0, index);
                    tail = self.state.detailInEditing.substring(index);
                } else {
                    head = self.state.detailInEditing;
                    tail = "";
                }
                let result = `${head}![](${imageServerBaseUrl}/${name})${tail}`;
                self.setState({ detailInEditing: result });
            } else {
                global.head.showAlert(false, data.errorMessage);
            }
        });
    },
    expand: function(theme: Theme) {
        let self: Self = this;

        let themes = self.state.themes;
        theme.expanded = true;
        theme.scrollTop = global.win.scrollTop();
        self.setState({ themes: themes });
    },
    collapse: function(theme: Theme) {
        let self: Self = this;

        let themes = self.state.themes;
        theme.expanded = false;
        global.win.scrollTop(theme.scrollTop);
        self.setState({ themes: themes });
    },
    componentDidMount: function() {
        let self: Self = this;

        global.body = self;
        self.getOrganizationsCurrentUserIn();
        intervalId = setInterval(self.setThemeTimeText, 10000);

        global.themeCreated = (theme: Theme) => {
            if (theme.organizationId === self.state.currentOrganizationId) {
                self.initTheme(theme);
                self.setState({ themes: [theme].concat(self.state.themes) });
            }
        };

        global.themeUpdated = (theme: Theme) => {
            if (theme.organizationId === self.state.currentOrganizationId) {
                let index = common.findIndex(self.state.themes, t => t.id === theme.id);
                if (index > -1) {
                    self.initTheme(theme);
                    let themes = self.state.themes;
                    theme.expanded = themes[index].expanded;
                    theme.scrollTop = themes[index].scrollTop;
                    themes[index] = theme;
                    self.setState({ themes: themes });
                }
            }
        };

        global.scrolled = () => {
            if (self.canShowMoreThemes()) {
                self.showMoreThemes();
            }
        };

        md = markdownit({
            linkify: true,
            highlight: function(str, lang) {
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

        let defaultImageRender = md.renderer.rules.image;
        md.renderer.rules.image = function (tokens, index, options, env, s) {
            let token = tokens[index];
            let aIndex = token.attrIndex("src");

            token.attrs[aIndex][1] = replaceProtocal(token.attrs[aIndex][1]);
            token.attrPush(["class", "theme-detail-image"]);

            return defaultImageRender(tokens, index, options, env, s);
        };

        let defaultLinkRender = md.renderer.rules.link_open || function(tokens, index, options, env, s) {
            return s.renderToken(tokens, index, options);
        };
        md.renderer.rules.link_open = function (tokens, index, options, env, s) {
            let aIndex = tokens[index].attrIndex("target");
            tokens[index].attrPush(["target", "_blank"]);
            tokens[index].attrPush(["rel", "nofollow"]);
            return defaultLinkRender(tokens, index, options, env, s);
        };
    },
    componentWillUnmount: function() {
        global.body = undefined;
        if (intervalId) {
            clearInterval(intervalId);
        }
        global.themeCreated = undefined;
        global.themeUpdated = undefined;
        global.scrolled = undefined;
        md = undefined;
    },
    getInitialState: function() {
        return {
            organizationsCurrentUserIn: [],
            currentOrganizationId: "",
            themes: [],
            newThemeTitle: "",
            newThemeDetail: "",
            currentPage: 1,
            totalCount: 0,
            themeIdInEditing: null,
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
    render: function() {
        let self: Self = this;

        let canSave = self.state.titleInEditing.trim() && self.state.requestCount === 0;

        let showMoreThemesView;
        if (self.canShowMoreThemes()) {
            showMoreThemesView = (
                <button type="button" className="btn btn-primary btn-lg col-sm-12" onClick={self.showMoreThemes}>
                    show {self.nextThemeCount()} more {self.nextThemeCount() > 1 ? "themes" : "theme"}(total {self.state.totalCount})
                </button>
            );
        } else {
            showMoreThemesView = (
                <button type="button" className="btn btn-primary btn-lg col-sm-12" disabled>
                    total {self.state.totalCount}
                </button>
            );
        }

        let themesView = self.state.themes.map(theme => {
            let themeTitleView;
            let themeDetailView;
            if (self.state.themeIdInEditing !== theme.id) {
                themeTitleView = (
                    <span>
                        {theme.title}
                        <span className={ "theme-title-status label label-" + (theme.status === types.themeStatus.open ? "success" : "danger") }>{theme.status}</span>
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
                        let imageView;
                        let textView = theme.summaryDetail.text.map((t, i) => {
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
                        if (theme.summaryDetail.image) {
                            imageView = (
                                <img src={theme.summaryDetail.image} className="float-left theme-head-image"/>
                            );
                        }
                        themeDetailView = (
                            <div onClick={self.expand.bind(this, theme)} className="clearfix pointer">
                                {imageView}
                                {textView}
                            </div>
                        );
                    }
                }
            } else {
                themeTitleView = (
                    <input className="form-control" onChange={self.titleInEditingChanged} value={self.state.titleInEditing}/>
                );
                themeDetailView = (
                    <textarea rows={10} className="form-control" onDragEnter={self.onDragEnter} onDragOver={self.onDragOver} onDragLeave={self.onDragLeave} onDrop={self.onDrop} onPaste={self.onPaste} onChange={self.detailInEditingChanged} value={self.state.detailInEditing}></textarea>
                );
            }

            let ownersView;
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

            let watchersView;
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

            let watchButton;
            if (theme.isWatching) {
                watchButton = (
                    <button type="button" className="btn btn-xs btn-link" onClick={self.unwatch.bind(this, theme)}>
                        unwatch
                    </button>
                );
            } else {
                watchButton = (
                    <button type="button" className="btn btn-xs btn-link" onClick={self.watch.bind(this, theme)}>
                        watch
                    </button>
                );
            }

            let hoveringView;
            if (theme.isHovering || theme.expanded || self.state.themeIdInEditing === theme.id) {
                let ownerView;
                if (theme.isOwner) {
                    let openButton;
                    if (theme.status === "open") {
                        openButton = (
                            <button type="button" className="btn btn-xs btn-link" onClick={self.close.bind(this, theme)}>
                                close
                            </button>
                        );
                    } else {
                        openButton = (
                            <button type="button" className="btn btn-xs btn-link" onClick={self.reopen.bind(this, theme)}>
                                reopen
                            </button>
                        );
                    }

                    let cancelButton;
                    let editButton;
                    let saveButton;
                    let uploadButton;
                    if (self.state.themeIdInEditing !== null) {
                        if (self.state.themeIdInEditing === theme.id) {
                            cancelButton = (
                                <div className="inline">
                                    •
                                    <button type="button" className="btn btn-xs btn-link"
                                        onClick={self.cancel.bind(this, theme)}>
                                        cancel
                                    </button>
                                </div>
                            );
                            if (canSave && (self.state.titleInEditing !== theme.title || self.state.detailInEditing !== theme.detail)) {
                                saveButton = (
                                    <div className="inline">
                                        •
                                        <button type="button" className="btn btn-xs btn-link"
                                            onClick={self.save.bind(this, theme)}>
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
                                        <input type="file" accept="image/*" onChange={self.onImageUploaded} className="theme-image-chooser"/>
                                    </button>
                                </div>
                            );
                        }
                    } else {
                        editButton = (
                            <div className="inline">
                                •
                                <button type="button" className="btn btn-xs btn-link"
                                    onClick={self.edit.bind(this, theme)}>
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
                let collapseButton;
                if (theme.expanded) {
                    collapseButton = (
                        <div className="inline">
                            •
                            <button type="button" className="btn btn-xs btn-link"
                                onClick={self.collapse.bind(this, theme)}>
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
                <tr key={theme.id} onMouseEnter={self.mouseEnterTheme.bind(this, theme)} onMouseLeave={self.mouseLeaveTheme.bind(this, theme)}>
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

        let organizationsView = self.state.organizationsCurrentUserIn.map(organization => {
            return (
                <label key={organization.id} className={ "the-label " + (self.state.currentOrganizationId === organization.id ? "label-active" : "") }
                    onClick={self.clickOrganization.bind(this, organization)}>
                    {organization.name}
                </label>
            );
        });

        let currentOrganizationView;
        if (self.state.currentOrganizationId !== "") {
            let createButton;
            if (self.state.newThemeTitle.trim() && self.state.requestCount === 0) {
                createButton = (
                    <button type="button" className="btn btn-primary" onClick={self.createTheme}>Create</button>
                );
            } else {
                createButton = (
                    <button type="button" className="btn btn-primary" disabled>Please input title</button>
                );
            }

            let showCreateView = (
                <span className={ "theme-add btn btn-primary glyphicon glyphicon-" + (self.state.showCreate ? "minus" : "plus") } aria-hidden="true" onClick={self.clickShowCreate}></span>
            );

            let newThemeTitleView;
            let newThemeDetailView;
            let createButtonView;
            if (self.state.showCreate) {
                newThemeTitleView = (
                    <div className="form-group">
                        <label className="col-sm-2 control-label">title</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" onChange={self.newThemeTitleChanged} value={self.state.newThemeTitle}/>
                        </div>
                    </div>
                );
                newThemeDetailView = (
                    <div className="form-group">
                        <label className="col-sm-2 control-label">detail</label>
                        <div className="col-sm-10">
                            <textarea className="form-control" rows={10} onChange={self.newThemeDetailChanged} value={self.state.newThemeDetail}></textarea>
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
                            <input className="form-control" onChange={self.qChanged} value={self.state.q} onKeyUp={self.qKeyUp}/>
                        </div>
                        <div className="col-sm-8">
                            <label className={ "the-label " + (self.state.isOpen ? "label-active" : "") } onClick={self.clickOpen}>
                                open
                            </label>
                            <label className={ "the-label " + (self.state.isClosed ? "label-active" : "") } onClick={self.clickClosed}>
                                closed
                            </label>
                            order by
                            <label className={ "the-label " + (self.state.order === "newest" ? "label-active" : "") } onClick={self.clickOrder.bind(this, "newest")}>
                                newest
                            </label>
                            <label className={ "the-label " + (self.state.order === "recently updated" ? "label-active" : "") } onClick={self.clickOrder.bind(this, "recently updated")}>
                                recently updated
                            </label>
                            <span className="glyphicon glyphicon-search btn btn-primary" aria-hidden="true" onClick={self.fetchThemes.bind(this, 1, undefined)}></span>
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

export let ThemesComponent = React.createClass(spec);
