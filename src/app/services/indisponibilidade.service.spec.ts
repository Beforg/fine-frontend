import { TestBed } from '@angular/core/testing';

import { IndisponibilidadeService } from './indisponibilidade.service';

describe('IndisponibilidadeService', () => {
  let service: IndisponibilidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndisponibilidadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
