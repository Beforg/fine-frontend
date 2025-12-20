import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFidelidadeComponent } from './modal-fidelidade.component';

describe('ModalFidelidadeComponent', () => {
  let component: ModalFidelidadeComponent;
  let fixture: ComponentFixture<ModalFidelidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFidelidadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFidelidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
