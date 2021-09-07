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
    private log: CloudWatchLogsClient | undefined;
    private logGroup: string = '';
    private readonly LogStreamNameDateFormat = 'YYYY-MM-DDTHH-mm-ss';
    private static isStreamCreationInProgress: boolean;
    private isReady: boolean = false;
    private isInitializing: boolean = false;

    private setup() {
        if (!utils.getAppParameter('AwsRegion') || this.isInitializing) {
            return;
        }
        this.isInitializing = true;
        const region = utils.getAppParameter('AwsRegion');
        const identityClient = new CognitoIdentityClient({region});
        const credentials = fromCognitoIdentityPool({identityPoolId: utils.getAppParameter('IdentityPoolId'), client: identityClient});
        this.log = new CloudWatchLogsClient({credentials, region});
        this.logGroup = utils.getAppParameter('DefaultLogGroup');
        if (!this.isLoginLoading()) {
            this.setupLogStream();
        }
        this.isReady = true;
        this.isInitializing = false;
    }

    public static getInstance = (): Logger => {
        if ((!Logger.instance || !Logger.instance.isLogStreamValid()) && !Logger.isStreamCreationInProgress) {
            Logger.instance = new Logger();
        }

        if (!Logger.instance.isReady) {
            Logger.instance.setup();
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
            logGroupName: this.logGroup,
            logStreamName: streamName
        });
        Logger.isStreamCreationInProgress = true;
        try {
            const data = await this.log?.send(params);
            Logger.isStreamCreationInProgress = false;
            return data?.$metadata.httpStatusCode;
        }
        catch (error: any) {
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
            const data = await this.log?.send(params);
            return data?.logStreams?.find((stream: LogStream) => stream.logStreamName === streamName);
        }
        catch (error: any) {
            console.log(error);
        }
    }

    private readonly putEvent = async (payload: Log) => {
        if (!this.isReady) {
            return;
        }
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
                const data = await this.log?.send(params);
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
        return new Date().getTime() - storedLogStream.creationTime < Number(utils.getAppParameter('LogStreamDuration')) &&
            storedLogStream.logStreamName?.slice(storedLogStream.logStreamName.lastIndexOf('-') + 1) === this.getUserName();
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
