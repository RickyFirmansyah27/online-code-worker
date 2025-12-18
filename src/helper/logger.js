import moment from 'moment';
import { createLogger, format, transports } from 'winston';
import Transport from 'winston-transport';

const { combine, timestamp, printf, colorize } = format;

// Custom transport for environments without process.stdout
class ConsoleTransport extends Transport {
  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const formattedMessage = info[Symbol.for('message')];
    console.log(formattedMessage);

    if (callback) {
      callback();
    }
  }
}

const loggerFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const Logger = createLogger({
    level: 'debug',
    format: combine(
        colorize(),
        timestamp({
            format: () => moment().format('ddd, DD MMM YYYY HH:mm:ss')
        }),
        loggerFormat
    ),
    transports: [new ConsoleTransport()]
});