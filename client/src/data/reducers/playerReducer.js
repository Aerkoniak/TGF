const initState = { player: {}, isLogged: false, isLeftHanded: false, autoLog: false, setActive: false };


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
            };
        case 'LOG_OUT':
            return {
                ...state,
                isLogged: false,
                player: {}
            };
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
            };
        case 'SET_PLAYER_NAME':
            return {
                ...state,
                msg: "Imię zmienione",
                player: action.character
            };
        case 'SET_PLAYER_PROFILE':
            return {
                ...state,
                msg: "Profil zmieniony",
                player: action.character
            };
        case 'SET_MSG':
            return {
                ...state,
                msg: action.msg
            };
        case 'CLEAN_MSG':
            return {
                ...state,
                msg: false
            };
        case 'TOGGLE_AUTOLOG':
            return {
                ...state,
                autoLog: action.payload
            };
        case 'SET_ACTIVE_TRUE':
            return {
                ...state,
                setActive: true
            }
        case 'SET_ACTIVE_FALSE':
            return {
                ...state,
                setActive: false
            }
        case 'UPDATE_PLAYER':
            console.log(action.payload)
            return {
                ...state,
                player: action.payload
            }


        default:
            return state
    }
}



export default playerReducer;