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
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let routerMock: Router;
  let authServiceMock: AuthService;
  let sessionServiceMock: SessionService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        AuthService,
        SessionService,
        Router,
      ],
      imports: [
        LoginComponent,
        HttpClientTestingModule,
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
    httpMock = TestBed.inject(HttpTestingController);
    authServiceMock = TestBed.inject(AuthService);
    sessionServiceMock = TestBed.inject(SessionService);
    routerMock = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check the login form invalid input', () => {
    component.form.controls['email'].setValue('notEmail');
    expect(component.form.invalid).toEqual(true);
    component.form.controls['password'].setValue('test!1234');
    expect(component.form.invalid).toEqual(true);
    component.form.controls['email'].setValue('');
    expect(component.form.invalid).toEqual(true);
    component.form.controls['email'].setValue('denis@gmail.com');
    expect(component.form.invalid).toEqual(false);
  });

  it('check the login', () => {
    component.form.controls['email'].setValue('denis@gmail.com');
    component.form.controls['password'].setValue('test!1234');
    expect(component.form.invalid).toEqual(false);

    let spySesService = jest.spyOn(sessionServiceMock, 'logIn');
    let spyAuthService = jest.spyOn(authServiceMock, 'login');
    let spyRouter = jest.spyOn(routerMock, 'navigate');
    
    component.submit();

    const mockRequest = httpMock.expectOne('/api/auth/login');
    expect(mockRequest.request.method).toBe('POST');

    mockRequest.flush({})

    expect(spyAuthService).toHaveBeenCalledTimes(1);
    expect(spySesService).toHaveBeenCalledTimes(1);
    expect(spyRouter).toHaveBeenCalledTimes(1);
    expect(spyRouter).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toEqual(false);
  });

  it('check the login failure', () => {
    component.form.controls['email'].setValue('denis@gmail.com');
    component.form.controls['password'].setValue('test!1234');
    expect(component.form.invalid).toEqual(false);

    let spyAuthService = jest.spyOn(authServiceMock, 'login');
    let spySesService = jest.spyOn(sessionServiceMock, 'logIn');
    let spyRouter = jest.spyOn(routerMock, 'navigate');
    
    component.submit();

    const mockRequest = httpMock.expectOne('/api/auth/login');
    expect(mockRequest.request.method).toBe('POST');

    mockRequest.flush('', {status: 401, statusText: 'Unauthorised!'});

    expect(spyAuthService).toHaveBeenCalledTimes(1);
    expect(spySesService).toHaveBeenCalledTimes(0);
    expect(spyRouter).toHaveBeenCalledTimes(0);
    expect(component.onError).toEqual(true);

    fixture.detectChanges();

    const errorMessage = document.getElementById('errorMes_login')!;
    expect(errorMessage.textContent).toContain('An error occurred');
  });

});
