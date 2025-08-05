import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilCardComponent } from './perfil-card.component';

describe('PerfilCardComponent', () => {
  let component: PerfilCardComponent;
  let fixture: ComponentFixture<PerfilCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
