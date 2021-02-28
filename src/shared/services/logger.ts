
import { CloudWatchLogs, CognitoIdentityCredentials } from 'aws-sdk';
import { LogStream, PutLogEventsRequest } from 'aws-sdk/clients/cloudwatchlogs';
import dayjs from 'dayjs';
import store from '../../app/store';

const logConfig = {
    region: process.env.REACT_APP_AWS_REGION,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID as string,
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
    data?: object,
    userName?: string;
}

class Logger {
    private static instance: Logger;
    private readonly log: CloudWatchLogs;
    private readonly streamName: string;
    private readonly logGroup: string;
    private logStream?: LogStream;
    private readonly LogStreamNameDateFormat = 'YYYY-MM-DDTHH-mm-ss';
    private nextUploadSequenceToken?: string;

    constructor(streamName?: string) {
        const credentials = new CognitoIdentityCredentials({ IdentityPoolId: logConfig.identityPoolId }, { region: logConfig.region });
        this.log = new CloudWatchLogs({ credentials, region: logConfig.region });

        this.logGroup = logConfig.logGroup
        this.streamName = `${(streamName || logConfig.logStream)}-${dayjs().format(this.LogStreamNameDateFormat)}`;

        this.getStream(this.streamName)
            .then(stream => {
                if (stream) {
                    this.logStream = stream;
                    this.nextUploadSequenceToken = stream?.uploadSequenceToken;
                } else {
                    this.log.createLogStream({
                        logGroupName: this.logGroup,
                        logStreamName: this.streamName
                    }, (err) => {
                        if (!err) {
                            this.getStream(this.streamName)
                                .then(response => {
                                    this.logStream = response;
                                    this.nextUploadSequenceToken = response?.uploadSequenceToken;
                                });
                        }
                    });
                }
            })
    }

    public static getInstance = (): Logger => {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    private readonly getStream = (streamName: string) => {
        return new Promise<LogStream | undefined>((resolve, reject) => {
            this.log.describeLogStreams(
                { logGroupName: this.logGroup, logStreamNamePrefix: streamName },
                (err, data) => {
                    if (err) {
                        console.log(err);
                        reject();
                    }
                    const logStream = data.logStreams?.find((stream) => stream.logStreamName === streamName);
                    resolve(logStream);
                })
        })
    }

    getUserName = () => {
        const userName = store.getState()?.appUserState?.auth?.username;
        return userName ?? 'no-user';
    }

    private readonly putEvent = (payload: Log) => {
        payload.userName = this.getUserName();
        const params: PutLogEventsRequest = {
            logEvents: [
                {
                    message: JSON.stringify(payload),
                    timestamp: Date.now()
                },
            ],
            logGroupName: this.logGroup,
            logStreamName: this.streamName,
            sequenceToken: this.nextUploadSequenceToken
        };
        this.log.putLogEvents(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
            } else {
                this.nextUploadSequenceToken = data.nextSequenceToken
            }
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
            level: LogLevel.Error,
            data: data
        }

        this.putEvent(log);
    }

    warn = (message: string, data?: object) => {
        const log: Log = {
            message: message,
            level: LogLevel.Warning,
            data: data
        }

        this.putEvent(log);
    }
}

export default Logger;
