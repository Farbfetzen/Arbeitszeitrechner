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

    // it("should render title", () => {
    //     const fixture = TestBed.createComponent(AppComponent);
    //     fixture.detectChanges();
    //     const compiled = fixture.nativeElement as HTMLElement;
    //     expect(compiled.querySelector("h1")?.textContent).toContain("Hello, Arbeitszeitrechner");
    // });
});
