import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroProfComponent } from './filtro-prof.component';

describe('FiltroProfComponent', () => {
  let component: FiltroProfComponent;
  let fixture: ComponentFixture<FiltroProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroProfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
