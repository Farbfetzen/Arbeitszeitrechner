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
    summarizeForSameJiraIssue = false;
    result: ResultElement[] = [];
    errorMessage = "";
    private readonly timeRegex = /(?<hours>[0-1]\d|2[0-3]):(?<minutes>[0-5]\d):(?<seconds>[0-5]\d)/;
    private readonly keyRegex = /(?<key>[a-zA-Z]+-\d+)?/;
    private readonly descriptionRegex = /(?<description>.+)?/;
    private readonly inputRegex = new RegExp(
        this.timeRegex.source + " *" + this.keyRegex.source + " *" + this.descriptionRegex.source,
    );

    updateResult(): void {
        this.result = [];
        this.errorMessage = "";
        const parsedTimeLog = this.parseTimeLog();
        if (!parsedTimeLog.length) {
            return;
        }
        this.createResult(parsedTimeLog);
    }

    private parseTimeLog(): TimeLog[] {
        this.rawTimeLog = this.rawTimeLog.trim();
        if (this.rawTimeLog === "") {
            return [];
        }
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
        const lastEntry = timeLogs[timeLogs.length - 1];
        if (lastEntry.key || lastEntry.description) {
            this.errorMessage = "Die letzte Zeile darf nur eine Uhrzeit enthalten.";
            return [];
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
        for (let i = 0; i < differences.length; i++) {
            this.result.push(new ResultElement(differences[i], parsedTimeLog[i].key, parsedTimeLog[i].description));
        }
        if (this.summarizeForSameJiraIssue) {
            this.summarizeResults();
        }
    }

    private summarizeResults(): void {
        const map = new Map();
        const elementsWithoutKeys = [];
        for (const element of this.result) {
            if (!element.key) {
                elementsWithoutKeys.push(element);
                continue;
            }
            if (!map.has(element.key)) {
                map.set(element.key, element);
                continue;
            }
            const value: ResultElement = map.get(element.key);
            let combinedDescription;
            if (value.description === element.description) {
                combinedDescription = value.description;
            } else {
                combinedDescription = [value.description, element.description].filter((str) => str).join(" | ");
            }
            map.set(
                element.key,
                new ResultElement(value.duration + element.duration, element.key, combinedDescription),
            );
        }
        this.result = [...map.values(), ...elementsWithoutKeys];
    }
}
