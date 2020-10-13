const initState = {
    races: [
        { id: "Człowiek", name: "Ludzie", desc: "", stats: [{ name: "Krzepa", value: 40 }, { name: "Szybkość", value: 40 }, { name: "Spostrzegawczość", value: 45 }, { name: "Zręczność", value: 40 }, { name: "Inteligencja", value: 40 }, { name: "Hart Ducha", value: 40 }] },
        { id: "Elf", name: "Elfowie", desc: "", stats: [{ name: "Krzepa", value: 40 }, { name: "Szybkość", value: 50 }, { name: "Spostrzegawczość", value: 50 }, { name: "Zręczność", value: 50 }, { name: "Inteligencja", value: 45 }, { name: "Hart Ducha", value: 40 }] },
        { id: "Krasnolud", name: "Krasnoludy", desc: "", stats: [{ name: "Krzepa", value: 45 }, { name: "Szybkość", value: 40 }, { name: "Spostrzegawczość", value: 45 }, { name: "Zręczność", value: 40 }, { name: "Inteligencja", value: 45 }, { name: "Hart Ducha", value: 50 }] },
        { id: "Długowieczny", name: "Stary Lud", desc: "", stats: [{ name: "Krzepa", value: 50 }, { name: "Szybkość", value: 40 }, { name: "Spostrzegawczość", value: 50 }, { name: "Zręczność", value: 45 }, { name: "Inteligencja", value: 40 }, { name: "Hart Ducha", value: 50 }] },],
    classes: [
        { id: "Mag", name: "Magowie", desc: "", baseAbilities: ["Koncentracja", "Szkoła Magii - wybrana", "Coś"] },
        { id: "Wojownik", name: "Wojownicy", desc: "", baseAbilities: ["Walka - wybrana", "Blok", "Coś"] },
        { id: "Łotrzyk", name: "Łotrzykowie", desc: "", baseAbilities: ["Uniki", "Kradzież", "Otwieranie zamków"] },
        { id: "Rzemieślnik", name: "Rzemieślnicy", desc: "", baseAbilities: ["Dziedzina - wybrana", "Targowanie", "Wycena"] },
    ],
    done: false,
};

const creatorReducer = (state = initState, action) => {
    switch (action.type) {
        case "SET_CHARACTER_START":
            return {
                ...state
            };
        case "RESET_CHARACTER_START":
            return {
                ...state
            }
        case "SET_CHARACTER_COMPLETE":
            return {
                ...state,
                player: action.character,
                done: true,
            };
            case "RESET_CHARACTER_COMPLETE":
            return {
                ...state,
                player: action.character,
                done: false,
            };

        default:
            return state
    }
}
export default creatorReducer;