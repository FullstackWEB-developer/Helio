import {
    CloudWatchLogsClient, LogStream, PutLogEventsCommand,
    DescribeLogStreamsCommand, CreateLogStreamCommand
} from '@aws-sdk/client-cloudwatch-logs';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-provider-cognito-identity';
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import store, {PersistenceStoreName} from '../../app/store';
import {setLogStream} from '@shared/store/app-user/appuser.slice';
import dayjs from 'dayjs';
import utils from '@shared/utils/utils';

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
    private static logGroup: string = '';
    private readonly LogStreamNameDateFormat = 'YYYY-MM-DDTHH-mm-ss';
    private static isInitializing: boolean;
    private static isReady: boolean;
    private static log: CloudWatchLogsClient | undefined;

    private constructor() {
        try{
            const region = utils.getAppParameter('AwsRegion');
            if (!region || Logger.isInitializing) {
                return;
            }
            Logger.isInitializing = true;
            const identityClient = new CognitoIdentityClient({region});
            const credentials = fromCognitoIdentityPool({identityPoolId: utils.getAppParameter('IdentityPoolId'), client: identityClient});
            Logger.log = new CloudWatchLogsClient({credentials, region});
            Logger.logGroup = utils.getAppParameter('DefaultLogGroup');
            if (!this.isLoginLoading()) {
                this.setupLogStream();
            }
            Logger.isReady = true;
            Logger.isInitializing = false;
        } catch (error: any) {

        }

    }

    public static getInstance = (): Logger => {
        if (!Logger.instance || !Logger.instance.isLogStreamValid() || !Logger.isReady) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private readonly getStoredLogStream = () => {
        const appUserState = JSON.parse(JSON.parse(localStorage.getItem(`persist:${PersistenceStoreName}`) || '{}')?.appUserState || '{}');
        return appUserState?.logStream;
    }

    private readonly storeLogStream = (logStream: LogStream) => {
        store.dispatch(setLogStream(logStream));
    }

    private readonly setupLogStream = async () => {
        const logStream = this.getStoredLogStream();
        if (!logStream || !this.isLogStreamValid()) {
            const newStreamName = `${this.getUserName()}-${dayjs().format(this.LogStreamNameDateFormat)}`
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
            logGroupName: Logger.logGroup,
            logStreamName: streamName
        });
        try {
            const data = await Logger.log?.send(params);
            return data?.$metadata.httpStatusCode;
        }
        catch (error: any) {
            console.log(error);
        }
    }

    private readonly getStream = async (streamName: string) => {
        const params = new DescribeLogStreamsCommand({
            logGroupName: Logger.logGroup,
            logStreamNamePrefix: streamName
        });

        try {
            const data = await Logger.log?.send(params);
            return data?.logStreams?.find((stream: LogStream) => stream.logStreamName === streamName);
        }
        catch (error: any) {
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
                logGroupName: Logger.logGroup,
                logStreamName: storedLogStream.logStreamName,
                ...(storedLogStream.uploadSequenceToken && {sequenceToken: storedLogStream.uploadSequenceToken})
            });

            try {
                const data = await Logger.log?.send(params);
                if (data?.nextSequenceToken) {
                    this.storeLogStream({...storedLogStream, uploadSequenceToken: data.nextSequenceToken});
                }
            }
            catch (error: any) {
                if (error.name === 'DataAlreadyAcceptedException') {
                    this.storeLogStream({...storedLogStream, uploadSequenceToken: error.expectedSequenceToken});
                    return;
                }
                if (error && error.message && error.expectedSequenceToken && error.message.includes("sequenceToken")) {
                    this.storeLogStream({...storedLogStream, uploadSequenceToken: error.expectedSequenceToken});
                }
            }
        }
    }

    isLogStreamValid = () => {
        const storedLogStream: LogStream = this.getStoredLogStream();
        if (!storedLogStream || !storedLogStream.creationTime) return false;
        const diff = dayjs().diff(dayjs(storedLogStream.creationTime), 'second')
        const configuredDuration = Number(utils.getAppParameter('LogStreamDuration'));
        return diff < configuredDuration && storedLogStream.logStreamName?.startsWith(this.getUserName());
    }

    getUserName = () => {
        const appUserState = JSON.parse(JSON.parse(localStorage.getItem(`persist:${PersistenceStoreName}`) || '{}')?.appUserState || '{}');
        return appUserState?.auth?.username ?? 'anonymous';
    }

    isLoginLoading = () => {
        const appUserState = JSON.parse(JSON.parse(localStorage.getItem(`persist:${PersistenceStoreName}`) || '{}')?.appUserState || '{}');
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
