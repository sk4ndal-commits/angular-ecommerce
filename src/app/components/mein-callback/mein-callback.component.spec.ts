import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeinCallbackComponent } from './mein-callback.component';

describe('MeinCallbackComponent', () => {
  let component: MeinCallbackComponent;
  let fixture: ComponentFixture<MeinCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeinCallbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeinCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
