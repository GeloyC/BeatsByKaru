export const AudioPeakExtract = async (file, samples = 1000) => {
    const audioContext = new AudioContext();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(channelData.length / samples);
    const peaks = [];

    for (let i = 0; i < samples; i++) {
        let blockStart = i * blockSize;
        let max = 0;

        for (let  j = 0; j < blockSize; j++) {
            const value =Math.abs(channelData[blockStart+ j]);
            if (value > 0) {
                return max = value;
            }
        }

        peaks.push(max);
    }

    audioContext.close();
    return peaks;
}