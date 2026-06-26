import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RightSidebarComponent } from './rightsidebar.component';
import { By } from '@angular/platform-browser';

describe('RightSidebarComponent', () => {
  let component: RightSidebarComponent;
  let fixture: ComponentFixture<RightSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightSidebarComponent] // Standalone component hai toh imports me aayega
    }).compileComponents();

    fixture = TestBed.createComponent(RightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initial data binding apply karne ke liye
  });

  // 1. Check if component creates successfully
  it('should create the right sidebar component', () => {
    expect(component).toBeTruthy();
  });

  // 2. Check if popular services are rendering completely
  it('should render the correct number of service items', () => {
    const serviceItems = fixture.debugElement.queryAll(By.css('.service-item'));
    expect(serviceItems.length).toBe(4); // Kyunki array me 4 items hain
  });

  // 3. Check if service name text is printed properly
  it('should display the correct service name in the list', () => {
    const firstServiceElement = fixture.debugElement.query(By.css('.service-name')).nativeElement;
    expect(firstServiceElement.textContent).toContain('Correspondence address update');
  });

  // 4. Test click interaction element
  it('should trigger onServiceClick when a service item is clicked', () => {
    spyOn(component, 'onServiceClick'); // Spy method behavior check karne ke liye

    const firstServiceItem = fixture.debugElement.query(By.css('.service-item'));
    firstServiceItem.triggerEventHandler('click', null);

    expect(component.onServiceClick).toHaveBeenCalledWith('Correspondence address update');
  });

  // 5. Check if What's New feed section renders correctly
  it('should render the correct number of what\'s new items', () => {
    const feedItems = fixture.debugElement.queryAll(By.css('.whats-new-item'));
    expect(feedItems.length).toBe(2); // Kyunki array me 2 elements define hain
  });
});
