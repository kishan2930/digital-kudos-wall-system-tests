export class Logger {
  // ANSI color codes for beautiful terminal output
  private static readonly colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
  };

  // Visual indicators
  private static readonly icons = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️',
    running: '🔄',
    completed: '✨',
    feature: '📋',
    scenario: '🎯',
    step: '👉',
    example: '📊',
    data: '💾',
  };

  static log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    process.stdout.write(
      `${this.colors.dim}[${timestamp}]${this.colors.reset} ${this.icons.info} ${this.colors.cyan}${message}${this.colors.reset}\n`
    );
  }

  static success(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    process.stdout.write(
      `${this.colors.dim}[${timestamp}]${this.colors.reset} ${this.icons.success} ${this.colors.green}${this.colors.bright}${message}${this.colors.reset}\n`
    );
  }

  static error(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    process.stderr.write(
      `${this.colors.dim}[${timestamp}]${this.colors.reset} ${this.icons.error} ${this.colors.red}${this.colors.bright}${message}${this.colors.reset}\n`
    );
  }

  static warning(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    process.stdout.write(
      `${this.colors.dim}[${timestamp}]${this.colors.reset} ${this.icons.warning} ${this.colors.yellow}${message}${this.colors.reset}\n`
    );
  }

  static feature(featureName: string) {
    process.stdout.write(
      `\n${this.colors.magenta}${this.colors.bright}${this.icons.feature} FEATURE: ${featureName}${this.colors.reset}\n`
    );
    process.stdout.write(`${this.colors.magenta}${'─'.repeat(50)}${this.colors.reset}\n`);
  }

  static scenario(scenarioName: string) {
    process.stdout.write(
      `\n  ${this.colors.blue}${this.colors.bright}${this.icons.scenario} SCENARIO: ${scenarioName}${this.colors.reset}\n`
    );
  }

  static exampleData(exampleValues: Record<string, string>, exampleIndex: number, totalExamples: number) {
    process.stdout.write(
      `    ${this.icons.example} ${this.colors.yellow}${this.colors.bright}EXAMPLE ${exampleIndex}/${totalExamples}:${this.colors.reset}\n`
    );
    
    Object.entries(exampleValues).forEach(([key, value]) => {
      process.stdout.write(
        `      ${this.icons.data} ${this.colors.cyan}${key}${this.colors.reset} = ${this.colors.white}${this.colors.bright}"${value}"${this.colors.reset}\n`
      );
    });
    process.stdout.write('\n');
  }

  static step(stepText: string, status: 'running' | 'passed' | 'failed' = 'running') {
    const icon = status === 'running' ? this.icons.running : 
                 status === 'passed' ? this.icons.success : this.icons.error;
    const color = status === 'running' ? this.colors.yellow : 
                  status === 'passed' ? this.colors.green : this.colors.red;
    
    process.stdout.write(
      `    ${icon} ${color}${stepText}${this.colors.reset}\n`
    );
  }

  static divider() {
    process.stdout.write(`\n${this.colors.cyan}${'═'.repeat(80)}${this.colors.reset}\n\n`);
  }

  static testSuite(suiteName: string) {
    this.divider();
    process.stdout.write(
      `${this.colors.bgBlue}${this.colors.white}${this.colors.bright} 🚀 ${suiteName.toUpperCase()} ${this.colors.reset}\n`
    );
    this.divider();
  }

  static summary(passed: number, failed: number, total: number) {
    this.divider();
    process.stdout.write(
      `${this.colors.bright}📊 TEST SUMMARY${this.colors.reset}\n`
    );
    process.stdout.write(
      `${this.icons.success} Passed: ${this.colors.green}${this.colors.bright}${passed}${this.colors.reset}\n`
    );
    if (failed > 0) {
      process.stdout.write(
        `${this.icons.error} Failed: ${this.colors.red}${this.colors.bright}${failed}${this.colors.reset}\n`
      );
    }
    process.stdout.write(
      `📋 Total: ${this.colors.cyan}${this.colors.bright}${total}${this.colors.reset}\n`
    );
    this.divider();
  }
}
