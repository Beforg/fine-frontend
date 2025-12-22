import { TestBed } from '@angular/core/testing';

import { NotificacaoOfflineService } from './notificacao-offline.service';

describe('NotificacaoOfflineService', () => {
  let service: NotificacaoOfflineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacaoOfflineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
