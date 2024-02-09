import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./app.component.html",
})
export class AppComponent {
    timeLog = "";

    // Summarize times that belong to the same Jira issue.
    summarizeForSameJiraIssue = true;

    // Round up times to the nearest 5 minutes.
    roundUpTo5 = true;

    result = "";

    updateResult(): void {
        // TODO: Update the output table
        // console.log(this.timeLog);
        // console.log("summarize: " + this.summarizeForSameJiraIssue);
        // console.log("round: " + this.roundUpTo5);
    }

    // TODO: Der identifier für Jira-Issues heißt "key". Also "ABC-123" ist der key.
}

/*
TODO: remove this
Test data

08:35:00 ABC-123 Make some coffee.
08:44:21 FOO-9999 Review a PR.
09:23:57 Pause
09:27:03 SOMETHING-777 Meeting.
11:03:22 CODE-42 Write some code.
12:15:01 Pause
12:59:31 INTERNAL-5555 Research something.
14:22:23 FOO-9999 Review again.
15:00:00 CODE-42 Finally back to programming.
16:55:12 INTERNAL-5556 Sort e-mails, log time.
17:10:42
*/
