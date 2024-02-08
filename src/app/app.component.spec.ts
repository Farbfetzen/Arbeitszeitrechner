import { TestBed } from "@angular/core/testing";

import { AppComponent } from "src/app/app.component";

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
    //     expect(compiled.querySelector("h1")?.textContent).toContain("Hello, Zeitlogginghelfer");
    // });
});
