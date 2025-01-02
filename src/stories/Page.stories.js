"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedIn = exports.LoggedOut = void 0;
const test_1 = require("@storybook/test");
const Page_1 = require("./Page");
const meta = {
    title: 'Example/Page',
    component: Page_1.Page,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
};
exports.default = meta;
exports.LoggedOut = {};
// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
exports.LoggedIn = {
    play: (_a) => __awaiter(void 0, [_a], void 0, function* ({ canvasElement }) {
        const canvas = (0, test_1.within)(canvasElement);
        const loginButton = canvas.getByRole('button', { name: /Log in/i });
        yield (0, test_1.expect)(loginButton).toBeInTheDocument();
        yield test_1.userEvent.click(loginButton);
        yield (0, test_1.expect)(loginButton).not.toBeInTheDocument();
        const logoutButton = canvas.getByRole('button', { name: /Log out/i });
        yield (0, test_1.expect)(logoutButton).toBeInTheDocument();
    }),
};
