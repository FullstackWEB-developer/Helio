import {
    CloudWatchLogsClient, LogStream, PutLogEventsCommand,
    DescribeLogStreamsCommand, CreateLogStreamCommand
} from '@aws-sdk/client-cloudwatch-logs';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-provider-cognito-identity';
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import store from '../../app/store';
import {setLogStream} from '@shared/store/app-user/appuser.slice';
import dayjs from 'dayjs';

const logConfig = {
    region: process.env.REACT_APP_AWS_REGION,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID as string,
    logGroup: process.env.REACT_APP_DEFAULT_LOG_GROUP || '',
    logStream: process.env.REACT_APP_DEFAULT_LOG_STREAM || '',
    logStreamValidityDuration: process.env.REACT_APP_LOG_STREAM_DURATION || 60000,
    helioStoreName: process.env.REACT_APP_PERSIST_HELIO_STORE_NAME || 'helio-ui-store'
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
    private readonly log: CloudWatchLogsClient;
    private readonly logGroup: string;
    private readonly LogStreamNameDateFormat = 'YYYY-MM-DDTHH-mm-ss';
    private static isStreamCreationInProgress: boolean;

    constructor() {
        const identityClient = new CognitoIdentityClient({region: logConfig.region});
        const credentials = fromCognitoIdentityPool({identityPoolId: logConfig.identityPoolId, client: identityClient});
        this.log = new CloudWatchLogsClient({credentials, region: logConfig.region});
        this.logGroup = logConfig.logGroup;
        if (!this.isLoginLoading()) {
            this.setupLogStream();
        }
    }

    public static getInstance = (): Logger => {
        if ((!Logger.instance || !Logger.instance.isLogStreamValid()) && !Logger.isStreamCreationInProgress) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private readonly getStoredLogStream = () => {
        const appUserState = JSON.parse(JSON.parse(localStorage.getItem(`persist:${logConfig.helioStoreName}`) || '{}')?.appUserState || '{}');
        return appUserState?.logStream;
    }

    private readonly storeLogStream = (logStream: LogStream) => {
        store.dispatch(setLogStream(logStream));
    }

    private readonly setupLogStream = async () => {
        const logStream = this.getStoredLogStream();
        if (!logStream || !this.isLogStreamValid()) {
            const newStreamName = `${logConfig.logStream}-${dayjs().format(this.LogStreamNameDateFormat)}-${this.getUserName()}`
            const newLogStreamStatusCode = await this.createStream(newStreamName);
            if (newLogStreamStatusCode && String(newLogStreamStatusCode)?.startsWith('2')) {
                const newLogStream = await this.getStream(newStreamName);
                if (newLogStream) {
                    this.storeLogStream(newLogStream);
                }
            }
        }
    }

    private readonly createStream = async (streamName: string) => {
        const params = new CreateLogStreamCommand({
            logGroupName: this.logGroup,
            logStreamName: streamName
        });
        Logger.isStreamCreationInProgress = true;
        try {
            const data = await this.log.send(params);
            Logger.isStreamCreationInProgress = false;
            return data.$metadata.httpStatusCode;
        }
        catch (error) {
            Logger.isStreamCreationInProgress = false;
            console.log(error);
        }
    }

    private readonly getStream = async (streamName: string) => {
        const params = new DescribeLogStreamsCommand({
            logGroupName: this.logGroup,
            logStreamNamePrefix: streamName
        });

        try {
            const data = await this.log.send(params);
            return data.logStreams?.find((stream: LogStream) => stream.logStreamName === streamName);
        }
        catch (error) {
            console.log(error);
        }
    }

    private readonly putEvent = async (payload: Log) => {
        const storedLogStream: LogStream = this.getStoredLogStream();
        if (storedLogStream && storedLogStream?.logStreamName) {
            payload.userName = this.getUserName();
            const params = new PutLogEventsCommand({
                logEvents: [
                    {
                        message: JSON.stringify(payload),
                        timestamp: Date.now()
                    },
                ],
                logGroupName: this.logGroup,
                logStreamName: storedLogStream.logStreamName,
                ...(storedLogStream.uploadSequenceToken && {sequenceToken: storedLogStream.uploadSequenceToken})
            });

            try {
                const data = await this.log.send(params);
                if (data?.nextSequenceToken) {
                    this.storeLogStream({...storedLogStream, uploadSequenceToken: data.nextSequenceToken});
                }
            }
            catch (error) {
                if (error && error.message && error.expectedSequenceToken && error.message.includes("sequenceToken")) {
                    this.storeLogStream({...storedLogStream, uploadSequenceToken: error.expectedSequenceToken});
                    this.putEvent(payload);
                }
            }
        }
    }

    isLogStreamValid = () => {
        const storedLogStream: LogStream = this.getStoredLogStream();
        if (!storedLogStream || !storedLogStream.creationTime) return false;
        return new Date().getTime() - storedLogStream.creationTime < Number(logConfig.logStreamValidityDuration) &&
            storedLogStream.logStreamName?.slice(storedLogStream.logStreamName.lastIndexOf('-') + 1) === this.getUserName();
    }

    getUserName = () => {
        const appUserState = JSON.parse(JSON.parse(localStorage.getItem(`persist:${logConfig.helioStoreName}`) || '{}')?.appUserState || '{}');
        return appUserState?.auth?.username ?? 'anonymous';
    }

    isLoginLoading = () => {
        const appUserState = JSON.parse(JSON.parse(localStorage.getItem(`persist:${logConfig.helioStoreName}`) || '{}')?.appUserState || '{}');
        return appUserState?.isLoading;
    }

    info = (message: string, data?: object) => {
        const log: Log = {
            message: message,
            level: LogLevel.Info,
            data: data
        }

        this.putEvent(log);
    }

    error = (message: string, data?: object | unknown) => {
        const log: Log = {
            message: message,
            level: LogLevel.Error,
            data: data as any
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
