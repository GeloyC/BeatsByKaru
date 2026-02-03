import { useRef, useState } from 'react';

export function useAudioPlayer() {
    const [playingId, setPlayingId] = useState(null);
    const refAudio = useRef({});

    const toggleAudioPlay = (audio_id) => {
        try {
            const audio = refAudio.current[audio_id];
            if (!audio) return;

            if (playingId === audio_id) {
                audio.pause();
                setPlayingId(null);
                return;
            }

            if (playingId !== null && refAudio.current[playingId]) {
                refAudio.current[playingId].pause();
            }

            audio.play();
            setPlayingId(audio_id);
        } catch (err) {
            console.error('Error playing audio: ', err);       
        }
    }

    return {
        refAudio,
        playingId,
        toggleAudioPlay
    };
}