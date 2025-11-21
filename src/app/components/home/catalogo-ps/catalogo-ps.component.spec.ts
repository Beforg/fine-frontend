import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoPsComponent } from './catalogo-ps.component';

describe('CatalogoPsComponent', () => {
  let component: CatalogoPsComponent;
  let fixture: ComponentFixture<CatalogoPsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoPsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoPsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
