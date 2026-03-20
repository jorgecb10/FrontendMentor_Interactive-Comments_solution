let state = null

export function setState(newState) {
    state = newState
}

export function getState() {
    return state
}

// COMMENTS

export function addComment(content) {
    const newComment = {
        id: Date.now(),
        content,
        createdAt: 'just now',
        score: 0,
        user: state.currentUser,
        replies: []
    }

    setState({
        ...state,
        comments: [...state.comments, newComment]
    })
}

export function deleteItem(id) {
    const updatedComments = state.comments
        .filter(comment => comment.id !== id)
        .map(comment => ({
            ...comment,
            replies: comment.replies.filter(r => r.id !== id)
        }))

    setState({
        ...state,
        comments: updatedComments
    })
}

export function updateContent(id, newContent) {
    const updatedComments = state.comments.map(comment => {
        if(comment.id === id) {
            return { ...comment, content: newContent }
        }

        const updatedReplies = comment.replies.map(reply => {
            if(reply.id === id) {
                return { ...reply, content: newContent }
            }
            return reply
        })

        return { ...comment, replies: updatedReplies }
    })

    setState({
        ...state,
        comments: updatedComments
    })
}

export function updateScore(id, operation) {
    const updatedComments = state.comments.map(comment => {

        if(comment.id === id) {
            return {
                ...comment,
                score: operation === 'increment'
                    ? comment.score + 1
                    : Math.max(comment.score - 1, 0)
            }
        }
        
        const updatedReplies = comment.replies.map(reply => {
            if(reply.id === id) {
                return {
                    ...reply,
                    score: operation === 'increment'
                        ? reply.score + 1
                        : Math.max(reply.score - 1, 0)
                }
            }
            return reply
        })

        return { ...comment, replies: updatedReplies }
    })

    setState({
        ...state,
        comments: updatedComments
    })
}

// REPLIES
export function addReply(parentId, content, replyingTo) {
    const updatedComments = state.comments.map(comment => {
        if(comment.id === parentId) {
            return {
                ...comment,
                replies: [
                    ...comment.replies,
                    {
                        id: Date.now(),
                        content,
                        createdAt: 'Just Now',
                        score: 0,
                        replyingTo,
                        user: state.currentUser
                    }
                ]
            }
        }
        return comment
    })

    setState({
        ...state,
        comments: updatedComments
    })
}