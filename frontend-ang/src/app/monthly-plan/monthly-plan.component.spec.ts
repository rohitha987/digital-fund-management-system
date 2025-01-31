import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPlanComponent } from './monthly-plan.component';

describe('MonthlyPlanComponent', () => {
  let component: MonthlyPlanComponent;
  let fixture: ComponentFixture<MonthlyPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
