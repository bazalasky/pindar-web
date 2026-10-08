export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function toSeconds(hours: number, minutes: number, seconds: number): number | null {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (!Number.isFinite(totalSeconds) || totalSeconds < 1) {
        return null;
    }
    return totalSeconds;
}