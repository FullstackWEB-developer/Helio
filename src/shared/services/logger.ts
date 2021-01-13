import AWS, {CloudWatchLogs, CognitoIdentityCredentials} from 'aws-sdk';
import {LogStream, PutLogEventsRequest} from "aws-sdk/clients/cloudwatchlogs";

const logConfig = {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || '',
    logGroup: process.env.REACT_APP_DEFAULT_LOG_GROUP || '',
    logStream: process.env.REACT_APP_DEFAULT_LOG_STREAM || '',
}

enum LogLevel {
    Info = 1,
    Warning,
    Error
}
interface Log {
    message: string,
    level: LogLevel,
    data?: object
}

class Logger {
    private log: CloudWatchLogs;
    private readonly streamName: string;
    private readonly logGroup: string;
    private logStream?: LogStream;

    constructor(streamName?: string) {
        const credentials = new CognitoIdentityCredentials({ IdentityPoolId: logConfig.identityPoolId });
        this.log = new CloudWatchLogs({credentials});

        this.logGroup = logConfig.logGroup
        this.streamName = streamName || logConfig.logStream;

        this.getStream(this.streamName)
            .then(stream => {
                if(stream) {
                    this.logStream = stream;
                } else {
                    this.log.createLogStream({
                        logGroupName: this.logGroup,
                        logStreamName: this.streamName
                    }, (err, data) => {
                        if(!err) {
                            this.getStream(this.streamName)
                                .then(stream => this.logStream = stream);
                        }
                    });
                }
            })
    }

    private getStream = (streamName: string) => {
        return new Promise<LogStream|undefined>((resolve, reject) => {
            this.log.describeLogStreams(
                {logGroupName: this.logGroup, logStreamNamePrefix: streamName},
                (err, data) => {
                if(err) {
                    console.log(err);
                    reject();
                }
                const logStream = data.logStreams?.find((stream) => stream.logStreamName === streamName);
                resolve(logStream);
            })
        })
    }

    private putEvent = (payload: Log) => {
        const params: PutLogEventsRequest = {
            logEvents: [
                {
                    message: JSON.stringify(payload),
                    timestamp: Date.now()
                },
            ],
            logGroupName: this.logGroup,
            logStreamName: this.streamName,
            sequenceToken: this.logStream?.uploadSequenceToken
        };
        this.log.putLogEvents(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else     console.log(data);
        });
    }

    info = (message: string, data?: object) => {
        const log: Log = {
            message: message,
            level: LogLevel.Info,
            data: data
        }

        this.putEvent(log);
    }

    error = (message: string, data?: object) => {
        const log: Log = {
            message: message,
            level: LogLevel.Info,
            data: data
        }

        this.putEvent(log);
    }

    message = (message: string, data?: object) => {
        const log: Log = {
            message: message,
            level: LogLevel.Info,
            data: data
        }

        this.putEvent(log);
    }
}

export default Logger;