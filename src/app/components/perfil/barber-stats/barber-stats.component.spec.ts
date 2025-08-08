import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberStatsComponent } from './barber-stats.component';

describe('BarberStatsComponent', () => {
  let component: BarberStatsComponent;
  let fixture: ComponentFixture<BarberStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
