// const db = require('../db/firestore');
const _ = require('lodash');

const spiesNet = [
    { id: 1, name: "Olivier", esp: 1 },
    { id: 2, name: "Gal", esp: 1 },
    { id: 3, name: "Ewa", esp: 2 },
    { id: 4, name: "Harry", esp: 2 },
    { id: 5, name: "Idka", esp: 3 },
    { id: 6, name: "Młoda", esp: 3 },
    { id: 7, name: "Żmij", esp: 4 },
    { id: 8, name: "Terken", esp: 4 },
    { id: 9, name: "Letka", esp: 5 },
    { id: 10, name: "Ergo", esp: 5 },
]

const secretMsg = {
    secretLvl: 3,
    text: "Chciałbym zaprosić Cię na rozmowę.",
    adresat: "Galadros"
}

const player = {
    name: "Aerkoniak",
    id: 1,
    spies: [1],
    familySpies: [5, 9]
}

// 1. Przechwytujemy obiekt gracza wysyłającego wiadomość i samą wiadomość
// 2. Sprawdzamy, którzy szpiedzy pilnują wysyłającego bezpośrednio lub rodu/organizacji do której należy
// 3. Łączymy tabele z punktu 2 by nie było multitestu szpiega.
// 3.5 Tworzymy funkcję rozróżniające instrukcje warunkowe dla testu.
// 4. Sprawdzamy listę wszystkich osób mających szpiegostwo: 
// 4A. Jeśli szpieg znajduje się na liście z pkt 3 stosujemy odpowiedni warunek
// 4B. Jeśli szpieg nie znajduje się na liście stosujemy prostszy warunek
// 5. Jeśli szpieg przechwycił wiadomość ustalamy ile się dowiedział
// 5.5 Jeś
// 6. Tworzymy tablicę ze szpiegami wg. tego ile się dowiedzieli
// 7. Tworzymy tablicę szpiegów, którzy wtopili i o których trzeba poinformować wysyłającego.
// 8. Mapujemy tablice z 6 i 7 wysyłając odpowiednie powiadomienia do dziennika.
// 9. uruchamiamy next() by przejść do punktu, w którym rzeczywiście wyślemy graczowi wiadomość.

const checkInterceptedMsg = (req, res, next) => {
    const secLvl = secretMsg.secretLvl;
    // pkt 1

    // pkt 2 i 3 
    let playerSpies = _.union(player.spies, player.familySpies);

    // pkt 3.5

    const checkHowMuchSpyKnows = (spyModifier, spy, secLvl) => {
        let k100 = Math.floor(Math.random() * 100) + 1;

        if (k100 + (secLvl * 10) <= 50 + spyModifier) {
            console.log(`${spy.name} przechwycił całą wiadomość.`)
        } else {
            console.log(`${spy.name} dowiedział się, że ${player.name} skontaktował się z ${secretMsg.adresat}`)
        }
    }

    const spyFollowsThePlayer = (k100, spy, secLvl) => {
        let modifiedK100 = k100 - 15;
        console.log(k100)
        let spyModifier = spy.esp * 5

        if (modifiedK100 <= spyModifier) {
            // szpieg coś przechwycił, ustalamy ile się dowiedział

            checkHowMuchSpyKnows(spyModifier, spy, secLvl)


        } else if (k100 > 90) {

            // szczepig wtopił i robimy drugi rzut by ustalić jak bardzo wtopi

            let k100 = Math.floor(Math.random() * 100) + 1;

            if (k100 - (secLvl * 5) >= 50 + spyModifier) {
                console.log(`${spy.name} ujawnił się jako bezpośredni szpieg ${player.name}`)
            } else {
                console.log(`${player.name} dowiedział się, że ktoś (${spy.name}) próbuje przechwytywać jego wiadomości.`)
            }

        } else {
            // szpieg niczego nie przechwycił
            console.log(`${spy.name} przeoczył wiadomość.`)
        }
    }

    const spyJustListening = (k100, spy) => {
        let spyModifier = spy.esp * 5
        console.log(k100)

        if (k100 <= spyModifier) {
            // szpieg coś przechwycił

            checkHowMuchSpyKnows(spyModifier, spy, secLvl)

        } else if (k100 === 100) {
            // szpieg wtopił i został odkryty
            console.log(`${spy.name} miał MEGA pecha i jego imię wypłynęło na ulicy jako wypytującego o ${player.name} lub jego rodzinę.`)
        } else {
            // szpieg niczego nie przechwycił
            console.log(`${spy.name} przeoczył wiadomość`)
        }
    }



    // pkt 4
    spiesNet.map(spy => {
        let k100 = Math.floor(Math.random() * 100) + 1;

        let flag = _.includes(playerSpies, spy.id);
        if (flag) {
            spyFollowsThePlayer(k100, spy, secLvl)
        } else {
            spyJustListening(k100, spy, secLvl)
        }
    })
    console.log(" ")





}



module.exports = checkInterceptedMsg;