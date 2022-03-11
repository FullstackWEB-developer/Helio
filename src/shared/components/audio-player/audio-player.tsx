import {useRef, useState, useEffect} from "react";
import SvgIcon, {Icon} from '@components/svg-icon';
import Slider from "@components/slider/slider";
import utils from "@shared/utils/utils";

const DEFAULT_INIT_TIME = '00:00:00';

interface AudioPlayerProps {
    url: string;
}

const AudioPlayer = ({url}: AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentAudioTime] = useState<string>(DEFAULT_INIT_TIME);
    const [duration, setDuration] = useState<number>(-1);
    const [currentValue, setCurrentValue] = useState(0);
    const [isAutoPlay, setAutoPlay] = useState(true);
    const isPlay = audioRef.current ? !audioRef.current.paused : false;

    useEffect(() => {
        if (!audioRef.current) {
            return () => { };
        }

        audioRef.current.load();
    }, [url]);

    useEffect(() => {
        if (audioRef?.current?.duration && audioRef?.current?.duration > 0) {
            setDuration(audioRef.current.duration);
        }
    }, [audioRef?.current])

    useEffect(() => {
        if (!audioRef.current) {
            return () => { };
        }
        const audioElement = audioRef.current;

        const setAudioTime = (target: HTMLAudioElement) => {
            setCurrentAudioTime(utils.formatTime(target.currentTime));
            setCurrentValue(target.currentTime);
        }

        audioElement.addEventListener('timeupdate', (e) => setAudioTime(e.target as HTMLAudioElement));

        return () => {
            audioElement.removeEventListener('timeupdate', (e) => setAudioTime(e.target as HTMLAudioElement));
        }

    }, []);

    const onPlayClick = () => {
        if (!isPlay) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }

    const onSliderChanged = (value: number) => {
        if (!audioRef.current) {
            return;
        }
        audioRef.current.currentTime = value;
    }

    const onAudioEnded = () => {
        setAutoPlay(false);
        audioRef.current?.load();
    }

    return (
        <div>
            <audio
                ref={audioRef}
                src={url}
                autoPlay={isAutoPlay}
                onEnded={onAudioEnded}
            />
            <div className='flex flex-row h-11'>
                <div className='self-start'>
                    <SvgIcon
                        className='cursor-pointer icon-large'
                        fillClass='rgba-05-fill'
                        type={!isPlay ? Icon.Play : Icon.Pause}
                        onClick={onPlayClick}
                    />
                </div>
                <div className='flex flex-col justify-center w-full ml-8'>
                    <Slider
                        min={0}
                        max={duration}
                        value={currentValue}
                        step={0.05}
                        onChange={onSliderChanged}
                    />
                    <div className='flex justify-between w-full mt-1'>
                        <span className='mr-4'>{currentTime}</span>
                        <span>{utils.formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AudioPlayer;
