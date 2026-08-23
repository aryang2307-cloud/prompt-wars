/**
 * Return the daily mess menu for a hostel.
 *
 * @param {Date} [date=new Date()] - Date used to select the menu.
 * @returns {{day: string, meals: Array<{name: string, items: string}>, closesAt: number}} Menu and closing hour.
 */
export function getMessMenu(date = new Date()) {
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  const menus = {
    Monday: [['Breakfast', 'Poha, eggs, tea'], ['Lunch', 'Rajma, rice, roti, salad'], ['Dinner', 'Paneer curry, dal, rice']],
    Tuesday: [['Breakfast', 'Idli, sambar, fruit'], ['Lunch', 'Chole, rice, roti, curd'], ['Dinner', 'Mixed veg, dal makhani, roti']],
    Wednesday: [['Breakfast', 'Stuffed paratha, curd, tea'], ['Lunch', 'Kadhi, rice, roti, salad'], ['Dinner', 'Veg noodles, manchurian, soup']],
    Thursday: [['Breakfast', 'Upma, toast, milk'], ['Lunch', 'Dal tadka, jeera rice, roti'], ['Dinner', 'Aloo gobi, dal, kheer']],
    Friday: [['Breakfast', 'Aloo puri, tea, fruit'], ['Lunch', 'Chana dal, rice, roti, salad'], ['Dinner', 'Veg biryani, raita, gulab jamun']],
    Saturday: [['Breakfast', 'Dosa, sambar, tea'], ['Lunch', 'Matar paneer, rice, roti'], ['Dinner', 'Dal fry, veg pulao, roti']],
    Sunday: [['Breakfast', 'Chole bhature, tea'], ['Lunch', 'Special thali, rice, dessert'], ['Dinner', 'Light khichdi, curd, papad']],
  };

  return { day, meals: menus[day] || menus.Monday, closesAt: 22 };
}

/**
 * Format time remaining until mess closure.
 *
 * @param {number} closesAt - Closing hour in local time.
 * @param {Date} date - Current local date and time.
 * @returns {string} Countdown label.
 */
export function getMessCountdown(closesAt, date) {
  const closing = new Date(date);
  closing.setHours(closesAt, 0, 0, 0);
  if (date >= closing) return 'Closed for today';
  const remainingMinutes = Math.max(0, Math.ceil((closing - date) / 60000));
  return `${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m left`;
}
