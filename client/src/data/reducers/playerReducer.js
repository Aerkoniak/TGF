const initState = { player: { name: "Aerkoniak", id: 0, rank: 1 }, isLogged: false };


const playerReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOG_IN': 
        return {
            ...state,
            isLogged: true
        };
        
        default:
            return state
    }
}

    

export default playerReducer;