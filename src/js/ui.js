import { getState } from "./state.js";

let editingCommentId = null

// RENDER
export function render() {
    const state = getState()
    const container = document.querySelector('.comments')

    container.innerHTML = ''

    state.comments.forEach(comment => {
        container.appendChild(createComment(comment))
    })
}

function createComment(item, isReply = false) {
    const state = getState()
    const isCurrentUser = item.user.username === state.currentUser.username

    const youBadge = isCurrentUser 
        ? `
            <span class="bg-purple-600 rounded-xs pt-0.5 pb-1.5 px-2 text-white font-semibold text-[14px] leading-none">you</span>
            `
        : ''

    const btns = isCurrentUser 
        ? addButtonsActions()
        : buttonReply()

    const wrapper = document.createElement('div')

    const divComment = document.createElement('DIV')
    divComment.dataset.id = item.id
    divComment.classList.add('comment', 'rounded-lg', 'shadow-md', 'p-4', 'md:p-6', 'flex', 'flex-col-reverse', 'md:flex-row', 'items-start', 'gap-5', 'bg-white', 'mb-5', 'relative', 'md:static')

    if(isReply) divComment.classList.add('md:ml-20', 'div-comment')

    divComment.innerHTML =  `
        <div class="bg-grey-50 px-3 md:px-1 md:py-4 flex md:flex-col items-center gap-1 rounded-xl font-bold">
            <a class="increment-score"><img src="../images/icon-plus.svg" class="icon-operation cursor-pointer"></a>
            <p class="score text-purple-600 min-w-8 text-center py-2 md:py-3">${item.score}</p>
            <a class="decrement-score"><img src="../images/icon-minus.svg" class="icon-operation cursor-pointer"></a>
        </div>
        <div class="w-full">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-5">
                    <picture>
                        <source
                            srcset="${item.user.image.webp}" 
                            type="image/webp">
                        <source 
                            srcset="${item.user.image.png}" 
                            type="image/png">
                        <img loading="lazy" decoding="async" src="${item.user.image.png}" alt="imagen" width=35px">
                    </picture>

                    <p data-username class="font-bold text-grey-800">${item.user.username}</p>

                    ${youBadge}

                    <p class="text-grey-500 font-semibold">${item.createdAt}</p>
                </div>

                ${btns}
            </div>

            <p class="text-comment mt-3 text-grey-500 font-semibold wrap-break-word break-all">
                ${
                    isReply
                        ? `<span class="text-purple-600 font-bold">@${item.replyingTo}</span>`
                        : ''
                }
                ${item.content}
            </p>
        </div>
    `

    wrapper.appendChild(divComment)

    if(!isReply && item.replies?.length) {
        const repliesContainer = document.createElement('div')
        repliesContainer.classList.add('mt-3', 'space-y-3', 'replies-container')

        item.replies.forEach(reply => {
            repliesContainer.appendChild(createComment(reply, true))
        })

        wrapper.appendChild(repliesContainer)
    }

    return wrapper
}

function addButtonsActions() {
    return `
        <div class="btns-actions-comment absolute bottom-4 right-4 md:static flex items-center gap-5">
            <button class="btn-delete-comment flex items-center gap-2 font-bold text-pink-400 cursor-pointer hover:opacity-50 transition-opacity">
                <img src="../../images/icon-delete.svg" alt="icon-delete">
                Delete
            </button>

            <button class="btn-edit-comment flex items-center gap-2 font-bold text-purple-600 cursor-pointer hover:opacity-50 transition-opacity">
                <img src="../../images/icon-edit.svg" alt="icon-edit">
                Edit
            </button>
        </div>
    `
}

function buttonReply() {
    return `
        <div class="absolute bottom-4 right-4 md:static">
            <button class="btn-reply flex items-center gap-2 font-bold text-purple-600 cursor-pointer hover:opacity-50 duration-200">
                <img src="./images/icon-reply.svg" alt="icon-reply">
                Reply
            </button>
        </div>
    `
}

export function renderCurrentUserAvatar() {
    const state = getState()
    
    const webpSource = document.querySelector('.user-webp')
    const pngSource = document.querySelector('.user-png')
    const imgFallback = document.querySelector('.img-user')

    webpSource.srcset = state.currentUser.image.webp
    pngSource.srcset = state.currentUser.image.png
    imgFallback.src = state.currentUser.image.png
    imgFallback.alt = state.currentUser.username
}

export function onEditComment(callback) {
    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn-edit-comment')
        if(!btn) return

        const replyBox = document.querySelector('.reply-box')
        if(replyBox) replyBox.remove()
        
        if(editingCommentId !== null) return

        const commentEl = btn.closest('.comment')
        if(!commentEl) return

        const id = Number(commentEl.dataset.id)

        editingCommentId = id

        const textEl = commentEl.querySelector('.text-comment')
        const clone = textEl.cloneNode(true)
        const span = clone.querySelector('span')

        if(span) span.remove()

        const currentText = clone.textContent.trim()

        const textArea = document.createElement('textarea')
        textArea.className = 'border border-grey-100 text-grey-800 rounded-lg flex-1 resize-none min-h-17.5 py-1 px-4 hover:border-purple-600 cursor-pointer transition-colors focus:outline outline-purple-600 w-full mt-3'
        textArea.value = currentText
        textArea.addEventListener('click', e => e.stopPropagation())

        const btnUpdate = document.createElement('button')
        btnUpdate.classList.add('btn-update-comment')
        btnUpdate.className = 'absolute bottom-4 right-4 md:static bg-purple-600 uppercase text-white font-semibold py-3 px-5 rounded-md leading-none cursor-pointer hover:opacity-50 transition-opacity'
        btnUpdate.textContent = 'Update'

        const btnsActions = commentEl.querySelector('.btns-actions-comment')

        textEl.replaceWith(textArea)
        btnsActions.replaceWith(btnUpdate)

        btnUpdate.addEventListener('click', () => {
            const newContent = textArea.value.trim()
            if(!newContent) return

            callback(id, newContent)

            editingCommentId = null
        })
    })
}

export function onDeleteComment(callback) {
    document.addEventListener('click', e => {
        if(editingCommentId !== null) return
        const replyBox = document.querySelector('.reply-box')
        if(replyBox) replyBox.remove()

        if(e.target.closest('.btn-delete-comment')) {
            const id = Number(
                e.target.closest('.comment').dataset.id
            )
            
            createModal(id, callback)
        }
    })
}

function createModal(id, callback) {
    const modal = document.createElement('dialog')
    modal.id = 'myModal'
    modal.classList.add('modal', 'max-w-[340px]', 'w-[90%]', 'mx-auto')
    modal.innerHTML = `
        <div class="modal-content">    
            <h2 class="font-bold text-lg text-grey-800">Delete comment</h2>
            <p class="my-3 text-grey-500">Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>

            <form method="dialog" class="font-semibold text-white flex items-center justify-between">
                <button class="btn-cancel rounded-md border-none bg-grey-500 py-1.5 px-5 uppercase cursor-pointer hover:opacity-50 transition-opacity">no, cancel</button>
                <button class="btn-confirm rounded-md border-none bg-pink-400 py-1.5 px-5 uppercase cursor-pointer hover:opacity-50 transition-opacity">yes, delete</button>
            </form>
        </div>
    `

    document.body.appendChild(modal)
    modal.showModal()

    //botones
    modal.querySelector('.btn-cancel')
        .addEventListener('click', () => {
            modal.remove()
        })

    modal.querySelector('.btn-confirm')
        .addEventListener('click', () => {
            callback(id)
            modal.remove()
        })
}

export function onIncDecScore(callback) {
    document.addEventListener('click', e => {
        const inc = e.target.closest('.increment-score')
        const dec = e.target.closest('.decrement-score')

        if(!inc && !dec) return

        const id = Number(e.target.closest('.comment').dataset.id)

        if(inc) callback(id, 'increment')
        else callback(id, 'decrement')
    })
}

export function updateScoreUI(id, operation) {
    const el = document.querySelector(`[data-id="${id}"]`)
    if(!el) return

    const scoreEl = el.querySelector('.score')
    if(!scoreEl) return

    let value = Number(scoreEl.textContent)

    if(operation === 'increment') value ++
    else value = Math.max(value - 1, 0)

    scoreEl.textContent = value
}

export function onReply(callback) {
    document.addEventListener('click', e => {
        if(editingCommentId !== null) return

        const btn = e.target.closest('.btn-reply')
        if(!btn) return

        const commentEl = btn.closest('.comment')
        const id = Number(commentEl.dataset.id)
        const state = getState()

        let parentId = null

        state.comments.forEach(comment => {
            if(comment.id === id) {
                parentId = comment.id
            }

            comment.replies.forEach(reply => {
                if(reply.id === id) {
                    parentId = comment.id
                }
            })
        })

        const existingBox = document.querySelector('.reply-box')

        if(existingBox) {
            existingBox.remove()
        }

        const username = commentEl.querySelector('[data-username]').textContent

        const box = document.createElement('div')
        box.classList.add('reply-box', 'mb-5', 'bg-white', 'shadow-md', 'rounded-lg', 'p-4', 'grid-cols-2', 'md:flex', 'md:items-start', 'md:justify-between', 'md:gap-3')

        box.innerHTML = `
            <picture class="user-picture col-span-1">
                <source
                    srcset="${state.currentUser.image.webp}" 
                    type="image/webp">
                <source 
                    srcset="${state.currentUser.image.png}" 
                    type="image/png">
                <img loading="lazy" decoding="async" src="${state.currentUser.image.png}" alt="imagen" width=35px">
            </picture>

            <textarea class="reply-textarea col-span-3 mb-4 md:mb-0 border border-grey-100 text-grey-800 rounded-lg resize-none min-h-17.5 pt-1 pb-10 px-4 hover:border-purple-600 cursor-pointer transition-colors focus:outline outline-purple-600 w-full">@${username} </textarea>

            <div class="flex items-start justify-end"><button class="btn-send-reply bg-purple-600 py-2 px-6 rounded-lg text-white font-semibold border-none cursor-pointer hover:opacity-50 transition-opacity">
                Reply
            </button></div>
        `

        commentEl.insertAdjacentElement('afterend', box)

        const textarea = box.querySelector('textarea')
        textarea.focus()

        box.querySelector('.btn-send-reply')
            .addEventListener('click', () => {
                const text = textarea.value.trim()
                if(!text) return

                const cleanText = text.replace(`@${username}`, '').trim()
                callback(parentId, cleanText, username)
                box.remove()
            })
    }) 
}

export function isEditing() {
    return editingCommentId !== null
}
