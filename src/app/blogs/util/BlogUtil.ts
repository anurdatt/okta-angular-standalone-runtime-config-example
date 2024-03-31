export class BlogUtil {
  calculateReadingTime(content: string): number {
    // Assuming average reading speed of 200 words per minute
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  }

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
}
