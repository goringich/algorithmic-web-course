"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedOut = exports.LoggedIn = void 0;
const test_1 = require("@storybook/test");
const Header_1 = require("./Header");
const meta = {
    title: 'Example/Header',
    component: Header_1.Header,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    args: {
        onLogin: (0, test_1.fn)(),
        onLogout: (0, test_1.fn)(),
        onCreateAccount: (0, test_1.fn)(),
    },
};
exports.default = meta;
exports.LoggedIn = {
    args: {
        user: {
            name: 'Jane Doe',
        },
    },
};
exports.LoggedOut = {};
