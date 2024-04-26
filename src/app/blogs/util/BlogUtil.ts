export class BlogUtil {
  calculateReadingTime(content: string): number {
    // Assuming average reading speed of 200 words per minute
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  }
}
