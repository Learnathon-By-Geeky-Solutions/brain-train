/**
 * Formats a start date and its 7-day end date in the format "Month Day(st/nd/rd/th) - Month Day(st/nd/rd/th)"
 * @param {string} startDateStr - Start date in YYYY-MM-DD format
 * @returns {string} Formatted date range string
 */
function formatMealPlanDateRange(startDateStr) {
    // Parse the start date
    const startDate = new Date(startDateStr);
    
    // Calculate the end date (7 days later)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // 7th day (start day + 6)
    
    // Format the dates
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  function getOtherWeekStartDate(startDateStr,nxt){
    const startDate = new Date(startDateStr);
    
    const otherStartDate = new Date(startDate);
    if(nxt){
        otherStartDate.setDate(startDate.getDate() + 7);
    }
    else{
        otherStartDate.setDate(startDate.getDate() - 7);
    }
    return otherStartDate.toISOString().split('T')[0];
  }
  
  /**
   * Formats a date as "Month Day(st/nd/rd/th)"
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string
   */
  function formatDate(date) {
    date = date instanceof Date ? date : new Date(date);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${month} ${day}${getDaySuffix(day)}`;
  }
  
  /**
   * Returns the appropriate suffix for a day number (st, nd, rd, th)
   * @param {number} day - Day of the month
   * @returns {string} Appropriate suffix
   */
  function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th'; // 4th to 20th
    
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
  /**
 * Generates an array of days of the week starting from the given date
 * @param {string|Date} startDate - Start date in YYYY-MM-DD format or Date object
 * @returns {string[]} Array of day names (Monday, Tuesday, etc.)
 */
function getDaysOfWeek(startDate) {
  // Convert string date to Date object if needed
  const date = startDate instanceof Date ? startDate : new Date(startDate);
  
  // Full day names
  const fullDayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  
  // Array to hold the 7 days starting from the startDate
  const daysArray = [];
  
  // Get the 7 days starting from startDate
  for (let i = 0; i < 7; i++) {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      const dayName = fullDayNames[currentDate.getDay()];
      daysArray.push(dayName);
    }
    
    return daysArray;
  }

  function getCurrentDateFormatted() {
    const today = new Date();
    console.log(today.toISOString().split('T')[0]);
    return today.toISOString().split('T')[0];
  }

  function getOffsetDate(dateStr, offset) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
  }

  function getDay(dateStr) {
    const date = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
  

  export { formatMealPlanDateRange };
  export { getOtherWeekStartDate };
  export { getDaysOfWeek };
  export { getCurrentDateFormatted };
  export { getOffsetDate };
  export { formatDate };
  export { getDay };