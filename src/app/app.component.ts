import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ResultElement } from "src/app/result";
import { TimeLog } from "src/app/time-log";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./app.component.html",
})
export class AppComponent {
    rawTimeLog = "";
    summarizeForSameJiraIssue = true;
    roundUpTo5 = true;
    result: ResultElement[] | null = null;
    errorMessage = "";
    private timeRegex = /(?<hours>[0-1]\d|2[0-3]):(?<minutes>[0-5]\d):(?<seconds>[0-5]\d)/;
    private keyRegex = /(?<key>[a-zA-Z]+-\d+)?/;
    private descriptionRegex = /(?<description>.+)?/;
    private inputRegex = new RegExp(
        this.timeRegex.source + " ?" + this.keyRegex.source + " ?" + this.descriptionRegex.source,
    );

    updateResult(): void {
        this.result = null;
        this.errorMessage = "";
        if (!this.rawTimeLog) {
            return;
        }
        const parsedInput = this.parseTimeLog();
        if (!parsedInput) {
            return;
        }
        this.createResult(parsedInput);
    }

    private parseTimeLog(): TimeLog[] | null {
        const timeLogs = [];
        for (const line of this.rawTimeLog.split("\n")) {
            const groups = this.inputRegex.exec(line)?.groups;
            if (!groups) {
                this.errorMessage = "Der Input entspricht nicht dem erwarteten Format.";
                return null;
            }
            timeLogs.push(
                new TimeLog(
                    groups["hours"],
                    groups["minutes"],
                    groups["seconds"],
                    groups["key"],
                    groups["description"],
                ),
            );
        }
        return timeLogs;
    }

    private createResult(parsedInput: TimeLog[]): void {
        const result: ResultElement[] = [];
        const times = parsedInput.map((line) => line.timeInSeconds);
        const differences = times.slice(1).map((t, index) => t - times[index]);
        if (differences.some((d) => d <= 0)) {
            this.errorMessage = "Die Zeiten müssen aufsteigend sein.";
            return;
        }
        // TODO: Sum differences for same keys if checkbox is ticked. The order of the results doesn't matter.

        const durations = [];
        for (const difference of differences) {
            // TODO: Round up seconds to nearest five minutes if checkbox is ticked.
            const hours = Math.floor(difference / 3600);
            const minutes = Math.ceil((difference % 3600) / 60);
            const h = hours > 0 ? hours + "h" : "";
            const m = minutes > 0 ? minutes + "m" : "";
            durations.push((h + " " + m).trim());
        }
        console.log(durations);
    }
}
