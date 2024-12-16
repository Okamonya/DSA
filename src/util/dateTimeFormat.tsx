// function to format date
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    }).format(date);
};

// function to format time range
export const formatTimeRange = (startTimeString: string, endTimeString: string): string => {
    const start = new Date(startTimeString);
    const end = new Date(endTimeString);
    const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

    const formattedStartTime = new Intl.DateTimeFormat('en-US', timeOptions).format(start);
    const formattedEndTime = new Intl.DateTimeFormat('en-US', timeOptions).format(end);

    return `${formattedStartTime} - ${formattedEndTime}`;
};
