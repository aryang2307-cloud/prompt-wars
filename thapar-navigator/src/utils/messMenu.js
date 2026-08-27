import { MESS_MENUS } from '../data/messMenus';

/**
 * Return the daily mess menu for a hostel.
 *
 * @param {Date} [date=new Date()] - Date used to select the menu.
 * @returns {{day: string, meals: Array<{name: string, items: string}>, closesAt: number}} Menu and closing hour.
 */
export function getMessMenu(date = new Date()) {
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  return { day, meals: MESS_MENUS[day] || MESS_MENUS.Monday, closesAt: 22 };
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
