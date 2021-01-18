const initState = { mails: [] };

const mailsReducer = (state = initState, action) => {
    switch (action.type) {
        case 'MAIL_FETCH_START': 
        return {
            ...state,
            fetch_status: "fetching"
        };
        case 'MAIL_FETCH_COMPLETE': 
        return {
            ...state,
            fetch_status: "complete",
            mails: action.mails
        };
        case 'MAIL_FETCH_FAILED': 
        return {
            ...state,
            fetch_status: "failed"
        };

        default:
            return state
    }
}
export default mailsReducer;