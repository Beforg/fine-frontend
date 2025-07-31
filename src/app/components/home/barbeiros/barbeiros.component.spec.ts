import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbeirosComponent } from './barbeiros.component';

describe('BarbeirosComponent', () => {
  let component: BarbeirosComponent;
  let fixture: ComponentFixture<BarbeirosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbeirosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarbeirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
