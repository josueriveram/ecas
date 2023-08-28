export const getHoursList = (includeForm = true, from = "06:30:00", to = "21:00:00", step = 15, date = new Date()) => {
    let list = [];
    let startDate = new Date(`${date.toDateString()} ${from}`);
    let endDate = new Date(`${date.toDateString()} ${to}`).getTime();
    while (startDate.getTime() < endDate) {
        startDate = new Date(startDate.getTime() + step * 60000);
        list.push(startDate.toLocaleString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    }
    list.length > 0 && includeForm && list.unshift(from);
    return list;
}