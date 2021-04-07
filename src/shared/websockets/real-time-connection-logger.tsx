import { ILogger, LogLevel } from "@microsoft/signalr";
import Logger from '../services/logger';

class RealTimeConnectionLogger implements ILogger {

    logger = Logger.getInstance();    

    log(logLevel: LogLevel = LogLevel.Error, message: string) {
        switch (logLevel) {

            case LogLevel.Critical: {
                this.logger.error(message);
                break;
            }

            case LogLevel.Error: {
                this.logger.error(message);
                break;
            }
        }
    }
}

export default RealTimeConnectionLogger;