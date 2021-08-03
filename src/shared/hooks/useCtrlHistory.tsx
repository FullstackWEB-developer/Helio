import {useEffect, useState} from 'react';
import {useHistory} from "react-router";

const CtrlHistory = () => {

    const [ctrlKeyPressed, setCtrlKeyPressed] = useState(false);
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey) {
            setCtrlKeyPressed(true);
        }
    };

    const handleKeyUp = (e: KeyboardEvent | FocusEvent) => {
        if (e instanceof KeyboardEvent && !e.ctrlKey) {
            setCtrlKeyPressed(false);
        }
    };

    const history = useHistory();

    let ctrlHistory = Object.assign({}, history, {
        push: (value: string) => {
            if (ctrlKeyPressed) {
                window.open(value);
            } else {
                history.push(value);
            }
        }
    });

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleKeyUp);
        };
    }, []);

    return ctrlHistory;
};

export default CtrlHistory;
