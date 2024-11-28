


export const  printDate = (date) => {


    date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getYear() + 1900;


    let mesec = ""
    switch(month) {
        case 0: 
            mesec = "January";
            break;
        case 1: 
            mesec = "February";
            break;
        case 2: 
            mesec = "March";
            break;
        case 3: 
            mesec = "April";
            break;
        case 4: 
            mesec = "May";
            break;
        case 5: 
            mesec = "June";
            break;
        case 6: 
            mesec = "July";
            break;
        case 7: 
            mesec = "August";
            break;
        case 8: 
            mesec = "September";
            break;
        case 9: 
            mesec = "October";
            break;
        case 10: 
            mesec = "November";
            break;
        case 11: 
            mesec = "December";
            break;
    }

    let nastavak = "";
    if (day === 1) {
        nastavak = "st";
    } else if (day === 2) {
        nastavak = "nd";
    } else if (day === 3) {
        nastavak = "rd";
    } else {
        nastavak = "th";
    }

    return mesec + " " + day + nastavak + ", " + year;
}