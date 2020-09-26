const initState = { mails: [{addreesse: {id:1,name: "Kot Olivier",}, sender: {id:0, name: "Frederick Ferr"}, title: "Tytuł 1 wiadomości", startDate: "Sobota, 22.", id: 654163541}] };

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

        default:
            return state
    }
}
export default mailsReducer;