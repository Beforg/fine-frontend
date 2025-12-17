import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticasTermosComponent } from './politicas-termos.component';

describe('PoliticasTermosComponent', () => {
  let component: PoliticasTermosComponent;
  let fixture: ComponentFixture<PoliticasTermosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticasTermosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticasTermosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
