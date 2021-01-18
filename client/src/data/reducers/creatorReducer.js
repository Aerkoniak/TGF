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
    origin: [
        { id: "Człowiek", name: "Ludzkie ziemie", desc: "Wychowanie wśród ludzi na kontynencie daje człowiekowi 2 dodatkowe dowolne umiejętności na poziomie Ponadprzeciętnym." },
        { id: "Elf", name: "Wyspy elfickie", desc: "Wychowanie wśród elfich braci daje graczowi umiejętność Akrobatyka na poziomie Ponadprzeciętnym" },
        { id: "Krasnolud", name: "Królestwo krasnoludów", desc: "Każdy krasnolud wychowany wśród swoich otrzymuje umiejętność Runotwórstwo na poziomie Przeciętnym." },
        { id: "Długowieczny", name: "Stare Ziemie", desc: "To najstarsze pochodzenie utwardza swoich ziomków i daje umiejętność Odporność na ból/strach na poziomie Ponadprzeciętnym" },
        { id: "Miasto", name: "Miasto - Akademia", desc: "Dorastanie w największym z Miast sprawia, iż poznaje się je od podszewki. Umiejętność Znajomość Miasta na poziomie Niezłym." }
    ],
    skills: [
        { name: "Broń drzewcowa", base: "Szybkość", cat: 1 },
        { name: "Broń dwuręczna", base: "Krzepa", cat: 1 },
        { name: "Broń jednoręczna", base: "Szybkość", cat: 1 },
        { name: "Broń krótka", base: "Zręczność", cat: 1 },
        { name: "Broń miotana", base: "Zręczność", cat: 1 },
        { name: "Dwie bronie", base: "Zręczność", cat: 1 },
        { name: "Walka bronią dystansową", base: "Zręczność", cat: 1 },
        { name: "Walka wręcz", base: "Zręczność", cat: 1 },
        { name: "Walka w zbroi", base: "Krzepa", cat: 1 },
        { name: "Walka z konia", base: "Zręczność", cat: 1 },
        { name: "Walka z tarczą", base: "Krzepa", cat: 1 },

        { name: "Blef", base: "Krzepa", cat: 2 },
        { name: "Fałszerstwo", base: "Inteligencja", cat: 2 },
        { name: "Identyfikacja", base: "Spostrzegawczość", cat: 2 },
        { name: "Kradzież kieszonkowa", base: "Zręczność", cat: 2 },
        { name: "Otwieranie zamków", base: "Zręczność", cat: 2 },
        { name: "Pułapki", base: "Inteligencja", cat: 2 },
        { name: "Skradanie się", base: "Zręczność", cat: 2 },
        { name: "Szulerstwo", base: "Szybkość", cat: 2 },
        { name: "Punkty witalne", base: "Inteligencja", cat: 2 },

        { name: "Alchemia", base: "Inteligencja", cat: 3 },
        { name: "Fleczerstwo", base: "Zręczność", cat: 3 },
        { name: "Gorzelnictwo", base: "Inteligencja", cat: 3 },
        { name: "Inżynieria", base: "Inteligencja", cat: 3 },
        { name: "Jubilerstwo", base: "Zręczność", cat: 3 },
        { name: "Kartografia", base: "Zręczność", cat: 3 },
        { name: "Kowalstwo", base: "Krzepa", cat: 3 },
        { name: "Krawiectwo", base: "Zręczność", cat: 3 },
        { name: "Płatnerstwo", base: "Krzepa", cat: 3 },
        { name: "Rzeźbiarstwo", base: "Zręczność", cat: 3 },
        { name: "Tworzenie bomb", base: "Inteligencja", cat: 3 },

        { name: "Akrobatyka", base: "Zręczność", cat: 4 },
        { name: "Charakteryzacja", base: "Inteligencja", cat: 4 },
        { name: "Czuwanie", base: "Hart Ducha", cat: 4 },
        { name: "Czytanie z ruchu warg", base: "Spostrzegawczość", cat: 4 },
        { name: "Jeździectwo", base: "Krzepa", cat: 4 },
        { name: "Kamuflaż", base: "Inteligencja", cat: 4 },
        { name: "Kryptografia", base: "Inteligencja", cat: 4 },
        { name: "Leczenie", base: "Inteligencja", cat: 4 },
        { name: "Nawigacja", base: "Inteligencja", cat: 4 },
        { name: "Odporność na ból", base: "Hart Ducha", cat: 4 },
        { name: "Odporność na strach", base: "Hart Ducha", cat: 4 },
        { name: "Pływanie", base: "Zręczność", cat: 4 },
        { name: "Powożenie", base: "Zręczność", cat: 4 },
        { name: "Sztuka przetrwania", base: "Spostrzegawczość", cat: 4 },
        { name: "Sztuki Piękne", base: "Inteligencja", cat: 4 },
        { name: "Targowanie", base: "Hart Ducha", cat: 4 },
        { name: "Torturowanie", base: "Hart Ducha", cat: 4 },
        { name: "Tresura", base: "Hart Ducha", cat: 4 },
        { name: "Tropienie", base: "Spostrzegawczość", cat: 4 },
        { name: "Uniki", base: "Inteligencja", cat: 4 },
        { name: "Wspinaczka", base: "Zręczność", cat: 4 },
        { name: "Wykształcenie", base: "Inteligencja", cat: 4 },
        { name: "Zielarstwo", base: "Inteligencja", cat: 4 },
        { name: "Znajomość Miasta", base: "Inteligencja", cat: 4 },

        { name: "Magia runiczna", base: "Inteligencja", cat: 5 },
        { name: "Magia szamańska", base: "Inteligencja", cat: 5 },
        { name: "Magia spirytystyczna", base: "Inteligencja", cat: 5 },
        { name: "Magia kapłańska", base: "Inteligencja", cat: 5 },

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