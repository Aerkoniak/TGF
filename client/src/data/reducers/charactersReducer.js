// const initState = {characters: [{
//     id: 0, name: "Frederick", rank: 0, profile: "Kilkuzdaniowy opis, określający postać."
// }]}
const initState = { characters: [] }


const charactersReducer = (state = initState, action) => {
    switch (action.type) {
        case 'FETCH_CHAR_START':
            return {
                ...state,
                fetch_characters: "fetching"
            };
        case 'FETCH_CHAR_SUCCESS':
            return {
                ...state,
                characters: action.payload
            };
        case 'UPDATE_CHARACTERS':
            console.log(action.payload)
            return {
                ...state,
                characters: action.payload
            };
        default:
            return state
    }
}
export default charactersReducer;