const initState = { stories: [{
    author: {name: "Aer", id: 0, rank: 0}, chapters: [], title: "Witajcie", startDate: "Czwartek, 17.09.2020, 15:21:14", id: 1600349041134, openMsg: `Wiadomość otwierająca sesje. Czyli teraz nie bardzo mam co w niej napisać, ponieważ przywitałem was już w tytule, a niczego więcej do przekazania chyba nie mam.`, spectators: []
}, ], downloadNeed: false, refID: false };

const storiesReducer = (state = initState, action) => {
    switch (action.type) {
        case 'FETCH_START': 
        return {
            ...state,
            fetch_status: "fetching"
        };
        case 'FETCH_COMPLETE': 
        return {
            ...state,
            fetch_status: "complete",
            stories: action.stories
        };
        case 'DOWNLOAD_NEED': 
        return {
            ...state,
            downloadNeed: action.payload
        };
       case 'STORY_CREATE_START':
           return {
               ...state,
           };
           case 'STORY_CREATE_SUCCESS':
            return {
                ...state,
                id: action.id
            };
            case 'STORY_SEEN':
            return {
                ...state,
                id: false
            };
        default:
            return state
    }
}
export default storiesReducer;