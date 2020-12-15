const pickPocket = (thief, victim) => {
    // USTALENIE  Zręczności Złodzieja i Spostrzegawczości Ofiary
    let thiefDext = 0;
    thief.stats.forEach(stat => { if (stat.name === "Zręczność") thiefDext = stat.val / 10 });
    let vicObserv = 0;
    victim.stats.forEach(stat => { if (stat.name === "Spostrzegawczość") vicObserv = stat.val / 10 })

    // USTALENIE Modyfikatora od Kradzieży Kieszonkowej
    let modifier = 0;
    let pickTheftLvl = 0;
    thief.skills.forEach(skill => { if (skill.name === "Kradzież kieszonkowa") pickTheftLvl = skill.lvl });
    switch (pickTheftLvl) {
        case 1: {
            modifier = 1;
        }
            break;
        case 2: {
            modifier = 2;
        }
            break;
        case 3: {
            modifier = 3;
        }
            break;
        case 4: {
            modifier = 4;
        }
            break;
        case 5: {
            modifier = 5;
        }
            break;
    }
    // console.log(thiefDext)
    // console.log(vicObserv)



    // USTALENIE SZANSY na kradzież na podstawie różnicy pomiędzy Zręcznością + Modyfikatorem, a Spostrzegawczością ofiary

    let chance = 0;
    let thiefScore = thiefDext + modifier;
    // console.log(thiefScore)
    let difference = thiefScore - vicObserv;
    // console.log(difference)
    if (difference < 0) {
        chance = 10;
    } else if (difference == 0) {
        chance = 20;
    } else if (difference <= 1) {
        chance = 30;
    } else if (difference <= 1.5) {
        chance = 40;
    } else if (difference <= 2) {
        chance = 50;
    } else if (difference <= 2.5) {
        chance = 60;
    } else if (difference <= 3) {
        chance = 70;
    } else if (difference <= 4) {
        chance = 80;
    } else if (difference <= 5) {
        chance = 90;
    } else if (difference > 5) {
        chance = 90;
    }
    // console.log(chance)

    // RZUT k100
    let k100 = Math.floor(Math.random() * 100) + 1;
    // console.log("k100 - ", k100)

    // USTALENIE i przypisanie Efektu na podstawie rzutu k100 i szansy z podziałem na skuteczność powodzenia.
    let effect = ""
    if (k100 < chance) {
        // console.log((chance - k100))
        if (k100 < (chance / 2)) {
            effect = `Kradzież kieszonkowa udała się, bo rzut wyniósł ${k100} przy szansie ${chance}. Kradzież była super udana, więc ofiara nie wie nawet kto i kiedy ją okradł.`
        } else {
            effect = `Kradzież kieszonkowa udała się, bo rzut wyniósł ${k100} przy szansie ${chance}. Ofiara zorientowała się jednak i zdołała zapamiętać parę szczegółów o napastniku.`
        }
    } else if (k100 == chance) {
        effect = `Kradzież kieszonkowa NIE udała się, bo rzut wyniósł ${k100} przy szansie ${chance}. Złodziej NIE MOŻE być zidentyfikowany.`
    } else {
        if (k100 > 90) {
            effect = `Kradzież kieszonkowa NIE udała się, bo rzut wyniósł ${k100} przy szansie ${chance}, w dodatku złodziej miał takiego pecha iż jego toższamość jest znana ofiarze.`
        } else {
            effect = `Kradzież kieszonkowa NIE udała się, bo rzut wyniósł ${k100} przy szansie ${chance}, a jak na złość ofiara jest w stanie powiedzieć coś o złodzieju.`
        }
    }

    return effect;
}

module.exports = pickPocket;