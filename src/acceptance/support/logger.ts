export class Logger {
  static log(message: string) {
    process.stdout.write(`[LOG] ${message}\n`);
  }

  static error(message: string) {
    process.stderr.write(`[ERROR] ${message}\n`);
  }
}
