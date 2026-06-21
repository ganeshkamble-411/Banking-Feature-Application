import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent] // Standalone component imports me hi rahega
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initial lifecycle trigger
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should have isDropdownOpen initialized to false', () => {
    // Assert: Dropdown default me closed rehna chahiye
    expect(component.isDropdownOpen).toBeFalse();
  });

  it('should toggle isDropdownOpen when toggleDropdown is called', () => {
    // Arrange: Create a fake MouseEvent to stop propagation safely
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation');

    // Act: Dropdown click logic trigger karo
    component.toggleDropdown(mockEvent);

    // Assert: Check dropdown true hua ya nahi
    expect(component.isDropdownOpen).toBeTrue();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();

    // Act Again: Dobara toggle karne par false hona chahiye
    component.toggleDropdown(mockEvent);
    expect(component.isDropdownOpen).toBeFalse();
  });

  it('should render the brand title "kotak" inside the DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoElement = compiled.querySelector('.brand-name');
    
    // Assert: Check naye selector ke hisab se text sahi hai ya nahi
    expect(logoElement?.textContent).toContain('kotak');
  });

  it('should dynamically display profile dropdown card only when isDropdownOpen is true', () => {
    // Act 1: Pehle check karo dropdown hidden hai (since *ngIf is false)
    let dropdownElement = fixture.nativeElement.querySelector('.profile-dropdown-card');
    expect(dropdownElement).toBeNull();

    // Act 2: TS variable ko direct true karo aur UI update karo
    component.isDropdownOpen = true;
    fixture.detectChanges();

    // Assert 2: Ab card DOM ke andar render ho jana chahiye
    dropdownElement = fixture.nativeElement.querySelector('.profile-dropdown-card');
    expect(dropdownElement).not.toBeNull();

    // User identity text validation verify karo
    const fullNameElement = fixture.nativeElement.querySelector('.user-full-name');
    expect(fullNameElement?.textContent).toContain('GANESH KAMBLE');
  });
});

