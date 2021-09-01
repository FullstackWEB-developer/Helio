import {useEffect, useState} from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';


const useFingerPrint = (): string => {
    const [fingerPrintCode, setFingerPrintCode] = useState<string>('');

    useEffect(() => {
        (async () => {
            const agent = await FingerprintJS.load();
            const fingerprint = await agent.get();
            setFingerPrintCode(fingerprint.visitorId);
        })();
    }, []);

    return fingerPrintCode;
};

export default useFingerPrint;
