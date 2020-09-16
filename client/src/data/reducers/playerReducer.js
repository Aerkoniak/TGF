const initState = { player: { login: "Aerkoniak", id: 0, rank: 1 }, isLogged: false, isLeftHanded: false };


const playerReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOG_IN_CHECKING':
        return {
            ...state,
            isLogged: "checking"
        };
        case 'LOG_IN': 
        return {
            ...state,
            isLogged: "logged", 
            player: action.player
        };
        case 'LOG_IN_NOT':
            return {
                ...state,
                isLogged: false,
                msg: action.msg
            }
        case 'TOGGLE_HAND':
            return {
                ...state,
                isLeftHanded: action.value
        };
        case 'REGISTER_PLAYER': 
        return {
            ...state,
            isLogged: "logged", 
            player: action.player
        }
        
        default:
            return state
    }
}

    

export default playerReducer;