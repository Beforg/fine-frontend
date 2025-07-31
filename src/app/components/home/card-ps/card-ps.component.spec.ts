import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPsComponent } from './card-ps.component';

describe('CardPsComponent', () => {
  let component: CardPsComponent;
  let fixture: ComponentFixture<CardPsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
