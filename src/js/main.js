import { getData } from "./storage.js";
import { setState } from "./state.js";
import { render, renderCurrentUserAvatar } from "./ui.js";
import { setupCommentHandler, setupDeleteHandler, setupEditHandler, setupReplyHandler, setupScoreHandler } from "./handlers.js";

async function initApp() {
    const data = await getData()
    setState(data)
    render()
    renderCurrentUserAvatar()
    setupCommentHandler()
    setupDeleteHandler()
    setupEditHandler()
    setupScoreHandler()
    setupReplyHandler()
}

document.addEventListener('DOMContentLoaded', initApp)