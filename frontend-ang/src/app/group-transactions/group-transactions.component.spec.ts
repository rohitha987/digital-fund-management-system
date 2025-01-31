import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTransactionsComponent } from './group-transactions.component';

describe('GroupTransactionsComponent', () => {
  let component: GroupTransactionsComponent;
  let fixture: ComponentFixture<GroupTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupTransactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
