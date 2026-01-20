import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';

import { FormComponent } from './form.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Session } from 'src/app/core/models/session.interface';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockRouter: Router;

  const mockSnackBar = {
    open: jest.fn()
  };
  
  const mockSessionData: Session = {
  id: 1,
  name: "Yoga du soir",
  description: "Le yoga du soir",
  date: new Date(),
  teacher_id: 1,
  users: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  }

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }
  const mockSessionApiService = {
     detail: jest.fn().mockReturnValue(of(mockSessionData)),
     create: jest.fn().mockReturnValue(of(mockSessionData)),
     update: jest.fn().mockReturnValue(of(mockSessionData)),
     delete: jest.fn().mockReturnValue(of({})),
     participate: jest.fn().mockReturnValue(of({})),
     unparticipate: jest.fn().mockReturnValue(of({})),
   }

  beforeEach(async () => {
    mockSessionService.sessionInformation.admin = true;

    TestBed.overrideComponent(FormComponent, {
      set: { providers: [{ provide: MatSnackBar, useValue: mockSnackBar }] },
    });
    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        FormComponent
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        Router,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    mockRouter = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back if no admin', () => {
    const spyRouter = jest.spyOn(mockRouter, 'navigate');

    mockSessionService.sessionInformation.admin = false;

    component.ngOnInit();

    expect(spyRouter).toHaveBeenCalledTimes(1);
    expect(spyRouter).lastCalledWith(['/sessions']);
  });

  it('test the form input and submit', () => {
    const spyApiService = jest.spyOn(mockSessionApiService, 'create');
    const spyRouter = jest.spyOn(mockRouter, 'navigate');
    const spySnack = jest.spyOn(mockSnackBar, 'open');

    const form = component.sessionForm;

    expect(form?.controls['name'].getRawValue()).toBe('');
    expect(form?.controls['date'].getRawValue()).toBe('');
    expect(form?.controls['teacher_id'].getRawValue()).toBe('');
    expect(form?.controls['description'].getRawValue()).toBe('');
    expect(form?.invalid).toBe(true);
    form?.controls['name'].setValue('Yoga du temps perdu');
    form?.controls['date'].setValue('11/11/2026');
    form?.controls['teacher_id'].setValue(1);
    form?.controls['description'].setValue('le yoga du temps perdu');
    expect(form?.invalid).toBe(false);

    component.submit();

    expect(spyApiService).toBeCalledTimes(1);
    expect(spyRouter).toBeCalledTimes(1);
    expect(spyRouter).toBeCalledWith(['sessions']);
    expect(spySnack).toBeCalledTimes(1);
  });

  
});
