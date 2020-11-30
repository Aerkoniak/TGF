const initState = {
    races: [
        { id: "Człowiek", name: "Ludzie", desc: "Ludzie nie dożywają więcej niż 90 lat, więc wiek grywalny kończy się na 80 latach.", stats: [{ name: "Krzepa", value: 40 }, { name: "Szybkość", value: 40 }, { name: "Spostrzegawczość", value: 45 }, { name: "Zręczność", value: 40 }, { name: "Inteligencja", value: 40 }, { name: "Hart Ducha", value: 40 }] },
        { id: "Elf", name: "Elfowie", desc: "Elfowie mogą żyć półtora stulecia, lecz wiek grywalny kończy się na 140 latach.", stats: [{ name: "Krzepa", value: 40 }, { name: "Szybkość", value: 50 }, { name: "Spostrzegawczość", value: 50 }, { name: "Zręczność", value: 50 }, { name: "Inteligencja", value: 45 }, { name: "Hart Ducha", value: 40 }] },
        { id: "Krasnolud", name: "Krasnoludy", desc: "Krasnoludy mogą żyć półtora stulecia, lecz wiek grywalny kończy się na 140 latach.", stats: [{ name: "Krzepa", value: 45 }, { name: "Szybkość", value: 40 }, { name: "Spostrzegawczość", value: 45 }, { name: "Zręczność", value: 40 }, { name: "Inteligencja", value: 45 }, { name: "Hart Ducha", value: 50 }] },
        { id: "Długowieczny", name: "Stary Lud", desc: "Długowieczni dożywają do 160 lat, a maksymalny wiek na rozpoczęcie gry to lat 140.", stats: [{ name: "Krzepa", value: 50 }, { name: "Szybkość", value: 40 }, { name: "Spostrzegawczość", value: 50 }, { name: "Zręczność", value: 45 }, { name: "Inteligencja", value: 40 }, { name: "Hart Ducha", value: 50 }] },],
    classes: [
        { id: "Mag", name: "Magowie", desc: "", baseAbilities: ["Koncentracja", "Szkoła Magii - wybrana", "Coś"] },
        { id: "Wojownik", name: "Wojownicy", desc: "", baseAbilities: ["Walka - wybrana", "Blok", "Coś"] },
        { id: "Łotrzyk", name: "Łotrzykowie", desc: "", baseAbilities: ["Uniki", "Kradzież", "Otwieranie zamków"] },
        { id: "Rzemieślnik", name: "Rzemieślnicy", desc: "", baseAbilities: ["Dziedzina - wybrana", "Targowanie", "Wycena"] },
    ],
    skills: [
        { name: "Walka wręcz", base: "Zręczność", cat: 1 }, { name: "Broń jednoręczna", base: "Krzepa", cat: 1 }, { name: "Broń miotana", base: "Zręczność", cat: 1 }, { name: "Leczenie", base: "Inteligencja", cat: 2 }, { name: "Wykształcenie", base: "Inteligencja", cat: 2 }, { name: "Tresura", base: "Hart Ducha", cat: 2 }, { name: "Kradzież kieszonkowa", base: "Zręczność", cat: 3 }, { name: "Blef", base: "Hart Ducha", cat: 3 }, { name: "Uniki", base: "Szybkość", cat: 3 }, { name: "Kowalstwo", base: "Krzepa", cat: 4 }, { name: "Inżyniera", base: "Inteligencja", cat: 4 }, { name: "Fleczerstwo", base: "Zręczność", cat: 4 }
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