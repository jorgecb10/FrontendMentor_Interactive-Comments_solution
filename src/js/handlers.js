import { addComment, deleteItem, updateContent, updateScore, addReply } from "./state.js";
import { render, onDeleteComment, onEditComment, onIncDecScore, updateScoreUI, onReply, isEditing } from "./ui.js";

export function setupCommentHandler() {
    const button = document.querySelector('.send-btn')
    const textArea = document.getElementById('comment')

    button.addEventListener('click', () => {
        if(isEditing()) return

        const content = textArea.value.trim()
        if(!content) return

        addComment(content)
        render()

        textArea.value = ''
    })
}

export function setupDeleteHandler() {
    onDeleteComment(id => {
        deleteItem(id)
        render()
    })
}

export function setupEditHandler() {
    onEditComment((id, newContent) => {
        updateContent(id, newContent)
        render()
    })
}

export function setupScoreHandler() {
    onIncDecScore((id, operation) => {
        updateScore(id, operation)
        updateScoreUI(id, operation)
    })
}

export function setupReplyHandler() {
    onReply((parentId, content, username) => {
        addReply(parentId, content, username)
        render()
    })
}