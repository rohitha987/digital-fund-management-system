import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChitplansComponent } from './chitplans.component';

describe('ChitplansComponent', () => {
  let component: ChitplansComponent;
  let fixture: ComponentFixture<ChitplansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChitplansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChitplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
