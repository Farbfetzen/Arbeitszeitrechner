import { TestBed } from "@angular/core/testing";

import { AppComponent } from "src/app/app.component";

const validTestData = `\
08:35:00 ABC-123 Erstmal Kaffee trinken
08:44:21 FOO-9999 Review
09:23:57 Pause
09:27:03 MEET-777 sehr wichtige Besprechung
11:03:22 CODE-42 Endlich Zeit zum Programmieren
12:15:01 Pause
12:59:31 INTERNAL-5555 Recherche
14:22:23 FOO-9999 Review
15:00:00 CODE-42 Programmieren für genau eine Stunde
16:00:00 MEET-99 Noch eine Besprechung.
16:55:12 INTERNAL-5556 E-Mails, Zeitlogging, etc.
17:10:42`;

describe("AppComponent", () => {
    let component: AppComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
        }).compileComponents();
        const fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the app", () => {
        expect(component).toBeTruthy();
    });

    it("should calculate durations without summarizing them", () => {
        Object.assign(component, { rawTimeLog: validTestData });
        component.updateResult();
        // prettier-ignore
        expect(component.result).toEqual([
            jasmine.objectContaining({ formattedDuration: "10m", key: "ABC-123", description: "Erstmal Kaffee trinken" }),
            jasmine.objectContaining({ formattedDuration: "40m", key: "FOO-9999", description: "Review" }),
            jasmine.objectContaining({ formattedDuration: "4m", key: undefined, description: "Pause" }),
            jasmine.objectContaining({ formattedDuration: "1h 37m", key: "MEET-777", description: "sehr wichtige Besprechung" }),
            jasmine.objectContaining({ formattedDuration: "1h 12m", key: "CODE-42", description: "Endlich Zeit zum Programmieren" }),
            jasmine.objectContaining({ formattedDuration: "45m", key: undefined, description: "Pause" }),
            jasmine.objectContaining({ formattedDuration: "1h 23m", key: "INTERNAL-5555", description: "Recherche" }),
            jasmine.objectContaining({ formattedDuration: "38m", key: "FOO-9999", description: "Review" }),
            jasmine.objectContaining({ formattedDuration: "1h", key: "CODE-42", description: "Programmieren für genau eine Stunde" }),
            jasmine.objectContaining({ formattedDuration: "56m", key: "MEET-99", description: "Noch eine Besprechung." }),
            jasmine.objectContaining({ formattedDuration: "16m", key: "INTERNAL-5556", description: "E-Mails, Zeitlogging, etc." }),
        ]);
        expect(component.errorMessage).toEqual("");
    });

    it("should calculate summarized durations", () => {
        Object.assign(component, { rawTimeLog: validTestData });
        component.summarizeForSameJiraIssue = true;
        component.updateResult();
        // prettier-ignore
        expect(component.result).toEqual([
            jasmine.objectContaining({ formattedDuration: "10m", key: "ABC-123", description: "Erstmal Kaffee trinken" }),
            jasmine.objectContaining({ formattedDuration: "1h 18m", key: "FOO-9999", description: "Review" }),
            jasmine.objectContaining({ formattedDuration: "1h 37m", key: "MEET-777", description: "sehr wichtige Besprechung" }),
            jasmine.objectContaining({ formattedDuration: "2h 12m", key: "CODE-42", description: "Endlich Zeit zum Programmieren | Programmieren für genau eine Stunde" }),
            jasmine.objectContaining({ formattedDuration: "1h 23m", key: "INTERNAL-5555", description: "Recherche" }),
            jasmine.objectContaining({ formattedDuration: "56m", key: "MEET-99", description: "Noch eine Besprechung." }),
            jasmine.objectContaining({ formattedDuration: "16m", key: "INTERNAL-5556", description: "E-Mails, Zeitlogging, etc." }),
            jasmine.objectContaining({ formattedDuration: "4m", key: undefined, description: "Pause" }),
            jasmine.objectContaining({ formattedDuration: "45m", key: undefined, description: "Pause" }),
        ]);
        expect(component.errorMessage).toEqual("");
    });

    ["foo", "12:34 TEST-123 Test", "123456 TEST-123 Test", "TEST-123 Test"].forEach((input) => {
        it(`should set errorMessage for malformed input "${input}"`, () => {
            Object.assign(component, { rawTimeLog: input });
            component.updateResult();
            expect(component.result).toEqual([]);
            expect(component.errorMessage).toEqual("Der Input entspricht nicht dem erwarteten Format.");
        });
    });

    ["", " ", "\n"].forEach((input) => {
        it(`should not error on empty or whitespace only input "${input}"`, () => {
            Object.assign(component, { rawTimeLog: input });
            component.updateResult();
            expect(component.result).toEqual([]);
            expect(component.errorMessage).toEqual("");
        });
    });

    [
        " 12:34:56 TEST-123 Test\n12:34:57",
        "12:34:56  TEST-123 Test\n12:34:57",
        "12:34:56 TEST-123  Test\n12:34:57",
        "12:34:56 TEST-123 Test \n12:34:57",
        "12:34:56 TEST-123 Test\n 12:34:57",
        "12:34:56 TEST-123 Test\n12:34:57 ",
        "\n12:34:56 TEST-123 Test\n12:34:57",
        "12:34:56 TEST-123 Test\n12:34:57\n",
    ].forEach((input) => {
        it(`should ignore extra whitespace in input "${input}"`, () => {
            Object.assign(component, { rawTimeLog: input });
            component.updateResult();
            expect(component.result).toEqual([
                jasmine.objectContaining({ formattedDuration: "1m", key: "TEST-123", description: "Test" }),
            ]);
            expect(component.errorMessage).toEqual("");
        });
    });

    ["12:34:56 TEST-123 Test\n12:34:55", "12:34:56 TEST-123 Test\n12:34:56"].forEach((input) => {
        it(`should error because times are not ascending in input "${input}"`, () => {
            Object.assign(component, { rawTimeLog: input });
            component.updateResult();
            expect(component.result).toEqual([]);
            expect(component.errorMessage).toEqual("Die Zeiten müssen aufsteigend sein.");
        });
    });

    it("should display 60 minutes as '1h'", () => {
        Object.assign(component, { rawTimeLog: "11:02:43 TEST-123 Foo\n12:02:25" });
        component.updateResult();
        expect(component.result).toEqual([
            jasmine.objectContaining({ formattedDuration: "1h", key: "TEST-123", description: "Foo" }),
        ]);
    });

    [
        { first: "foo", second: "", expected: "foo" },
        { first: "", second: "foo", expected: "foo" },
        { first: "", second: "", expected: undefined },
    ].forEach((params) => {
        it(`should combine descriptions "${params.first}" and "${params.second}" to "${params.expected}"`, () => {
            Object.assign(component, {
                rawTimeLog: `01:23:45 TEST-123 ${params.first}\n02:23:45 TEST-123 ${params.second}\n03:23:45`,
            });
            component.summarizeForSameJiraIssue = true;
            component.updateResult();
            expect(component.result).toEqual([
                jasmine.objectContaining({ formattedDuration: "2h", key: "TEST-123", description: params.expected }),
            ]);
        });
    });

    ["12:34:56 TEST-123 Test", "12:34:56 TEST-123 Test 1\n12:34:57 TEST-456"].forEach((input) => {
        it(`should display an error if last line contains more than just a time for input "${input}"`, () => {
            Object.assign(component, { rawTimeLog: input });
            component.updateResult();
            expect(component.result).toEqual([]);
            expect(component.errorMessage).toEqual("Die letzte Zeile darf nur eine Uhrzeit enthalten.");
        });
    });
});
