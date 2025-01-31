import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserTransactionsComponent } from './view-user-transactions.component';

describe('ViewUserTransactionsComponent', () => {
  let component: ViewUserTransactionsComponent;
  let fixture: ComponentFixture<ViewUserTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUserTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
