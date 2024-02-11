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
        component.rawTimeLog = validTestData;
        component.updateResult();
        expect(component.result).toEqual([
            { key: "ABC-123", description: "Erstmal Kaffee trinken", duration: "10m" },
            { key: "FOO-9999", description: "Review", duration: "40m" },
            { key: undefined, description: "Pause", duration: "4m" },
            { key: "MEET-777", description: "sehr wichtige Besprechung", duration: "1h 37m" },
            { key: "CODE-42", description: "Endlich Zeit zum Programmieren", duration: "1h 12m" },
            { key: undefined, description: "Pause", duration: "45m" },
            { key: "INTERNAL-5555", description: "Recherche", duration: "1h 23m" },
            { key: "FOO-9999", description: "Review", duration: "38m" },
            { key: "CODE-42", description: "Programmieren für genau eine Stunde", duration: "1h" },
            { key: "MEET-99", description: "Noch eine Besprechung.", duration: "56m" },
            { key: "INTERNAL-5556", description: "E-Mails, Zeitlogging, etc.", duration: "16m" },
        ]);
        expect(component.errorMessage).toEqual("");
    });

    ["foo", "12:34 TEST-123 Test", "123456 TEST-123 Test", "TEST-123 Test"].forEach((input) => {
        it(`should set errorMessage for malformed input "${input}"`, () => {
            component.rawTimeLog = input;
            component.updateResult();
            expect(component.result).toEqual([]);
            expect(component.errorMessage).toEqual("Der Input entspricht nicht dem erwarteten Format.");
        });
    });

    ["", " ", "\n"].forEach((input) => {
        it(`should not error on empty or whitespace only input "${input}"`, () => {
            component.rawTimeLog = input;
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
            component.rawTimeLog = input;
            component.updateResult();
            expect(component.result).toEqual([{ key: "TEST-123", description: "Test", duration: "1m" }]);
            expect(component.errorMessage).toEqual("");
        });
    });

    ["12:34:56 TEST-123 Test\n12:34:55", "12:34:56 TEST-123 Test\n12:34:56"].forEach((input) => {
        it(`should error because times are not ascending in input "${input}"`, () => {
            component.rawTimeLog = input;
            component.updateResult();
            expect(component.result).toEqual([]);
            expect(component.errorMessage).toEqual("Die Zeiten müssen aufsteigend sein.");
        });
    });
});
