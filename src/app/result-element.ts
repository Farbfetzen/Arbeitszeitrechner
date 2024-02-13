export class ResultElement {
    duration: number;
    formattedDuration: string;
    key?: string;
    description?: string;

    constructor(duration: number, key?: string, description?: string) {
        this.duration = duration;
        this.formattedDuration = this.formatDuration(duration);
        this.description = description;
        this.key = key;
    }

    formatDuration(seconds: number): string {
        // Round up to full minutes.
        seconds = Math.ceil(seconds / 60) * 60;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.ceil((seconds % 3600) / 60);
        const h = hours > 0 ? hours + "h" : "";
        const m = minutes > 0 ? minutes + "m" : "";
        return (h + " " + m).trim();
    }
}
