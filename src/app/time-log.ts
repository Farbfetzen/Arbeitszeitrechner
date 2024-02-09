export class TimeLog {
    timeInSeconds: number;
    key?: string;
    description?: string;

    constructor(hours: string, minutes: string, seconds: string, key?: string, description?: string) {
        this.timeInSeconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
        this.key = key;
        this.description = description;
    }
}
