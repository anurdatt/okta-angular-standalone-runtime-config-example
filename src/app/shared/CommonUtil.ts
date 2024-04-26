export class CommonUtil {
  formatDate(inputDate: string): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const [year, month, day] = inputDate.split('-');
    const monthIndex = parseInt(month) - 1;
    const formattedDate = `${months[monthIndex]} ${parseInt(day)}, ${year}`;
    return formattedDate;
  }

  formatRelativeDate(date: Date): string {
    const currentDate = new Date();
    const diffMilliseconds = currentDate.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  }
}
