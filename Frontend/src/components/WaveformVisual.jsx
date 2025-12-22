import React, { useState, useRef, useEffect } from "react";

function Waveform({ peaks, progress }) {
    const activeBars = Math.floor(progress * peaks.length);

    return (
        <div className="w-full h-[40px]">
            <svg
                viewBox="0 0 600 80"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "100%" }}
            >
                {peaks.map((p, i) => (
                <rect
                    key={i}
                    x={(600 / peaks.length) * i}
                    y={(80 - p * 3) / 2}
                    width={600 / peaks.length - 0.5}
                    height={p * 3}
                    fill={i < activeBars ? "#03f8c5" : "#CCC"}
                />
                ))}
            </svg>
        </div>
    );
}

async function projectAudioFile(
        audio,
        setPeaksFn,
        setProgressFn,
        setIsPlayingFn,
        audioRef,
        setAudioFileName
    ) {
    if (!audio) return;

    setProgressFn(0);
    setIsPlayingFn(false);
    setPeaksFn([]);

    let url;
    let arrayBuffer;

    if (audio instanceof File) {
        url = URL.createObjectURL(audio);
        arrayBuffer = await audio.arrayBuffer();
        setAudioFileName(audio.name);
    } else if (typeof audio === "string") {
        url = audio;
        const response = await fetch(audio);
        arrayBuffer = await response.arrayBuffer();
        setAudioFileName(audio.split("/").pop());
    }

    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const samples = 200;
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / samples);
    const peaksArray = [];

    for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[i * blockSize + j]);
        }
        peaksArray.push((sum / blockSize) * 100);
    }

    setPeaksFn(peaksArray);

    if (audioRef.current) {
        audioRef.current.src = url;
    }
}

export default function AudioVisualizer({ audio }) {
    const [peaks, setPeaks] = useState([]);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioFileName, setAudioFileName] = useState("");
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audio) return;
        projectAudioFile(
            audio,
            setPeaks,
            setProgress,
            setIsPlaying,
            audioRef,
            setAudioFileName
        );
    }, [audio]);

    if (!audio) return null;

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl) return;

        const updateProgress = () => {
            const pct = audioEl.currentTime / audioEl.duration;
            setProgress(isNaN(pct) ? 0 : pct);
        };

        audioEl.addEventListener("timeupdate", updateProgress);
        audioEl.addEventListener("ended", () => {
            setIsPlaying(false);
            setProgress(0);
        });

        return () => {
            audioEl.removeEventListener("timeupdate", updateProgress);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="flex items-center gap-2 w-full min-w-full">
            <button onClick={togglePlay} disabled={!peaks.length} className="size-10 p-1 rounded-full border border-[#005F60]">
                {isPlaying ? (
                    <img src="/src/assets/icons/pause_aquamarine.png" alt="pause icon" className="size-6 pl-1"/>
                ) : (
                    <img src="/src/assets/icons/play_teal.png" alt="play icon" className="pl-1"/>
                )}
            </button>
            {/* {audioFileName && <p>{audioFileName}</p>} */}
            <Waveform peaks={peaks} progress={progress} />
            <audio ref={audioRef} hidden />
        </div>
    );
}
