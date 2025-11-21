import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAgendamentoComponent } from './form-agendamento.component';

describe('FormAgendamentoComponent', () => {
  let component: FormAgendamentoComponent;
  let fixture: ComponentFixture<FormAgendamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAgendamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAgendamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
