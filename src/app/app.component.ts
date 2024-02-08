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

    updateResult(): void {
        // TODO: Update the output table
        // console.log(this.timeLog);
        // console.log("summarize: " + this.summarizeForSameJiraIssue);
        // console.log("round: " + this.roundUpTo5);
    }

    // TODO: Der identifier für Jira-Issues heißt "key". Also "ABC-123" ist der key.
}
