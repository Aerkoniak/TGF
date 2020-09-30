const initState = { taverns: [{name: "Sala Główna", records: []}, {name: "OffTop", records: []}] };

const tavernReducer = (state = initState, action) => {
    switch (action.type) {
        case 'FETCH_TAVERN_START': 
        return {
            ...state,
            tavern_fetch_status: "start",
        };
        case 'FETCH_TAVERN_COMPLETE': 
        return {
            ...state,
            tavern_fetch_status: "complete",
            taverns: action.taverns
        };
        case 'ADD_TAVERN_RECORD_START': 
        return {
            ...state,
            tavern_add_record_status: "start",
        };
        case 'ADD_TAVERN_RECORD_COMPLETE': 
        return {
            ...state,
            tavern_add_record_status: "complete",
        };
        default:
            return state
    }
}
export default tavernReducer;