const initState = { player: { name: "Aerkoniak", id: 0, rank: 1 }, isLogged: false, isLeftHanded: false };


const playerReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOG_IN': 
        return {
            ...state,
            isLogged: true
        };
        case 'TOGGLE_HAND':
            return {
                ...state,
                isLeftHanded: !state.player.isLeftHanded
        };
        
        default:
            return state
    }
}

    

export default playerReducer;