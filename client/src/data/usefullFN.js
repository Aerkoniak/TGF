// Funkcje, które będą używane w wielu komponentach, takie jak ustalanie daty i inne pierdółki. 

export const createDate = (givenDate) => {
    let date = new Date();
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