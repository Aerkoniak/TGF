// Funkcje, które będą używane w wielu komponentach, takie jak ustalanie daty i inne pierdółki. 

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
  

        date = new Date(year, month-1, day, hour, minute, second, milisecond)
        console.log(date)
        let dayIndex = date.getDay();
        let timeString = date.toLocaleString();
        console.log(timeString)

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