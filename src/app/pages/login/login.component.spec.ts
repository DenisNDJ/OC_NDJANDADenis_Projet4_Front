import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/core/service/auth.service';
import { Router } from '@angular/router';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

 const routerMock = {
      navigate: jest.fn(),
    };

  const authServiceMock = {
      login: jest.fn(),
    };

 const sessionServiceMock = {
      login: jest.fn(),
    };

  const sessionInformationMock: SessionInformation = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    type: 'Bearer',
    id: 1,
    username: 'NdjandaD',
    firstName: 'Denis',
    lastName: 'Ndjanda',
    admin: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {provide: AuthService, useValue: authServiceMock,},
        {provide: SessionService, useValue: sessionServiceMock,},
        {provide: Router, useValue: routerMock,},
      ],
      imports: [
        LoginComponent,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
