import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ResultElement } from "src/app/result-element";
import { TimeLog } from "src/app/time-log";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
    rawTimeLog = "";
    summarizeForSameJiraIssue = true;
    result: ResultElement[] = [];
    errorMessage = "";
    private readonly timeRegex = /(?<hours>[0-1]\d|2[0-3]):(?<minutes>[0-5]\d):(?<seconds>[0-5]\d)/;
    private readonly keyRegex = /(?<key>[a-zA-Z]+-\d+)?/;
    private readonly descriptionRegex = /(?<description>.+)?/;
    private readonly inputRegex = new RegExp(
        this.timeRegex.source + " ?" + this.keyRegex.source + " ?" + this.descriptionRegex.source,
    );

    updateResult(): void {
        this.result = [];
        this.errorMessage = "";
        if (!this.rawTimeLog) {
            return;
        }
        const parsedTimeLog = this.parseTimeLog();
        if (!parsedTimeLog) {
            return;
        }
        this.createResult(parsedTimeLog);
    }

    private parseTimeLog(): TimeLog[] {
        const timeLogs = [];
        for (const line of this.rawTimeLog.split("\n")) {
            const groups = this.inputRegex.exec(line)?.groups;
            if (!groups) {
                this.errorMessage = "Der Input entspricht nicht dem erwarteten Format.";
                return [];
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

    private createResult(parsedTimeLog: TimeLog[]): void {
        const times = parsedTimeLog.map((line) => line.timeInSeconds);
        const differences = times.slice(1).map((t, index) => t - times[index]);
        if (differences.some((d) => d <= 0)) {
            this.errorMessage = "Die Zeiten müssen aufsteigend sein.";
            return;
        }
        // TODO: Sum differences for same keys if checkbox is ticked. The order of the results doesn't matter.

        for (let i = 0; i < differences.length; i++) {
            const difference = differences[i];
            const hours = Math.floor(difference / 3600);
            const minutes = Math.ceil((difference % 3600) / 60);
            const h = hours > 0 ? hours + "h" : "";
            const m = minutes > 0 ? minutes + "m" : "";
            const duration = (h + " " + m).trim();
            this.result.push({
                duration: duration,
                key: parsedTimeLog[i].key,
                description: parsedTimeLog[i].description,
            });
        }
    }
}
