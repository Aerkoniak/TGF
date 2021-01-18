// Funkcje, które będą używane w wielu komponentach, takie jak ustalanie daty i inne pierdółki. 
import axios from 'axios';
import { updateActive } from '../data/actions/generalActions';

export const createDate = (givenDate) => {
    let date = new Date();

    if (givenDate) {
        let year = Number(givenDate.slice(0, 4))
        let month = Number(givenDate.slice(5, 7))

        let day = Number(givenDate.slice(8, 10))
        let hour = Number(givenDate.slice(12, 14))
        let minute = Number(givenDate.slice(15, 17))
        let second = 0;
        let milisecond = 0;


        date = new Date(year, month - 1, day, hour, minute, second, milisecond)
        let dayIndex = date.getDay();
        let timeString = date.toLocaleString();

        let dayName = "";

        switch (dayIndex) {
            case 0:
                dayName = "Niedziela";
                break;
            case 1:
                dayName = "Poniedziałek"
                break;
            case 2:
                dayName = "Wtorek"
                break;
            case 3:
                dayName = "Środa"
                break;
            case 4:
                dayName = "Czwartek"
                break;
            case 5:
                dayName = "Piątek"
                break;
            case 6:
                dayName = "Sobota"
                break;
        };
        const nextTurnDate = `${dayName}, ${timeString}`;
        return nextTurnDate;

    } else {
        let dayIndex = date.getDay();
        let timeString = date.toLocaleString();
        let day = "";

        switch (dayIndex) {
            case 0:
                day = "Niedziela";
                break;
            case 1:
                day = "Poniedziałek"
                break;
            case 2:
                day = "Wtorek"
                break;
            case 3:
                day = "Środa"
                break;
            case 4:
                day = "Czwartek"
                break;
            case 5:
                day = "Piątek"
                break;
            case 6:
                day = "Sobota"
                break;
        };
        const startDate = `${day}, ${timeString}`;
        return startDate;
    }
}

export const checkOrigins = (player) => {
    let skillsArray = [];
    let howManyBonuses = 0;
    let whatCat = [];

    switch (player.class) {
        case 'Mag': {
            howManyBonuses++;
            whatCat = 5;
        }
            break;
        case 'Wojownik': {
            howManyBonuses++;
            whatCat = 1;
        }
            break;
        case 'Łotrzyk': {
            howManyBonuses++;
            whatCat = 2;
        }
            break;
        case 'Rzemieślnik': {
            howManyBonuses++;
            whatCat = 3;
        }
            break;
    }
    switch (player.race) {
        case 'Człowiek': {
            if (whatCat === 5) {
                let skill = {
                    name: "Magia kapłańska",
                    lvl: 2,
                    cat: 5,
                    base: "Inteligencja"
                }
                skillsArray.push(skill)
            }
        }
            break;
        case 'Elf': {
            if (whatCat === 5) {
                let skill = {
                    name: "Magia spirytystyczna",
                    lvl: 2,
                    cat: 5,
                    base: "Inteligencja"
                }
                skillsArray.push(skill)
            }
        }
            break;
        case 'Krasnolud': {
            if (whatCat === 5) {
                let skill = {
                    name: "Magia runiczna",
                    lvl: 1,
                    cat: 5,
                    base: "Inteligencja"
                }
                skillsArray.push(skill)
            }
        }
            break;
        case 'Długowieczny': {
            if (whatCat === 5) {
                let skill = {
                    name: "Magia szamańska",
                    lvl: 2,
                    cat: 5,
                    base: "Inteligencja"
                }
                skillsArray.push(skill)
            }
        }
            break;
    }
    switch (player.origin) {
        case 'Człowiek':
            {
                howManyBonuses += 2;
                whatCat = 6;
            }
            break;
        case 'Elf':
            {
                let skill = {
                    name: "Akrobatyka",
                    lvl: 2,
                    cat: 4,
                    base: "Zręczność"
                }
                skillsArray.push(skill)

            }
            break;
        case 'Długowieczny':
            {
                let skill = {
                    name: "Sztuka przetrwania",
                    lvl: 2,
                    cat: 4,
                    base: "Spostrzegawczość"
                }
                skillsArray.push(skill)
            }
            break;
        case 'Krasnolud':
            {
                if (whatCat === 5) {

                } else {
                    let skill = {
                        name: "Magia runiczna",
                        lvl: 1,
                        cat: 5,
                        base: "Inteligencja"
                    }
                    skillsArray.push(skill)
                }

            }
            break;
        case 'Miasto':
            {
                let skill = {
                    name: "Znajomość Miasta",
                    lvl: 3,
                    cat: 4,
                    base: "Inteligencja"
                }
                skillsArray.push(skill)
            }
            break;
        default:
            {

            }
    }


    let response = {
        howManyBonuses,
        whatCat,
        skillsArray
    }
    return response

}

