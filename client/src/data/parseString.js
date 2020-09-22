import React from 'react';


export const parseString = (string) => {

    // tworzymy nową tablicę, która w późniejszym etapie będzie źródłem React.Elementów.
    let newArrayOfStrings = []
    // Dzielimy stringa podanego przy wywoływaniu funkcji po enterach i tworzymy tym samym stringsArray
    let stringsArray = string.split('\n');
    // Sprawdzamy każdy element tablicy stringsArray pod kątem występujących w nim tagów.
    stringsArray.map((singleString, index) => {

        let openB = singleString.includes("<b>");
        let closeB = singleString.includes("</b>");
        let openI = singleString.includes("<i>");
        let closeI = singleString.includes("</i>");

        if (!openB && !closeB) {
            // console.log(`W stringu${index} nie ma żadnych tagów`);
            let stringObject = {};
            stringObject.normalText = singleString;
            newArrayOfStrings.push(stringObject)
        }

        else if (openB && closeB) {
            let openedIndex = singleString.indexOf("<b>");
            // console.log(openedIndex)

            if (openedIndex === 0) {
                // console.log(`String ${index} jest cały pogrubiony`);
                let stringObject = {};
                stringObject.fullBoldText = singleString.slice(3, -5);
                newArrayOfStrings.push(stringObject)
            } else if (openedIndex > 0) {
                // console.log(`String ${index} jest pogrubiony w części, ale i zamknięty.`);
                let stringObject = {};

                let betterArray = [];
                let splittedInMiddle = singleString.split("<b>");
                let secondSplit = splittedInMiddle[1].split("</b>");
                betterArray.push(splittedInMiddle[0]);
                let concatedArray = betterArray.concat(secondSplit);
                stringObject.beforeBoldedTag = concatedArray[0];
                stringObject.boldenTextInMiddle = concatedArray[1];
                stringObject.afterBoldedTag = concatedArray[2];
                newArrayOfStrings.push(stringObject)
            }
        }

        else if (openB && !closeB) {
            // console.log(`W stringu ${index} otwieramy TAG B, ale go nie zamykamy.`);
            const splitedString = singleString.split("<b>");
            let stringObject = {};
            stringObject.normalTextOpened = splitedString[0];
            stringObject.boldTextFinish = splitedString[1];
            newArrayOfStrings.push(stringObject)

            if (stringsArray[index + 1].includes("</b>")) {
                return
            }

            let newThisString = stringsArray[index].concat("</b>");
            let openB = "<b>";
            let newNextString = openB.concat(stringsArray[index + 1]).concat("</b>");
            stringsArray.splice((index), 2, newThisString, newNextString);

        }

        else if (!openB && closeB) {
            // console.log(`W stringu ${index} sami zamykamy TAG B`);

            let stringObject = {};
            const splitedString = singleString.split("</b>");
            // console.log(splitedString);
            stringObject.boldenFirstText = splitedString[0];
            stringObject.normalLaterText = splitedString[1];
            newArrayOfStrings.push(stringObject)


            let openB = "<b>";
            let newThisString = openB.concat(stringsArray[index]);
            stringsArray.splice((index), 1, newThisString)
        }
    })

    // zwracamy z funkcji tablicę utworzoną na jej początku, teraz już pełną odpowiednio posegregowanych stringów, mapujemy ją i ZWRACAMY z każdego mapowanego elementu React.Fragment;
    

}