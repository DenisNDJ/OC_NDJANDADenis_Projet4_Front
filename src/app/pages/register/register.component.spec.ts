import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: AuthService;
  let mockRouter: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        AuthService,
        Router
      ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RegisterComponent,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    mockAuthService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check the register form invalid input', () => {
    component.form.controls['firstName'].setValue('denis');
    expect(component.form.invalid).toEqual(true);
    component.form.controls['lastName'].setValue('ndjanda');
    expect(component.form.invalid).toEqual(true);
    component.form.controls['email'].setValue('notEmail');
    expect(component.form.invalid).toEqual(true);
    component.form.controls['password'].setValue('test!1234');
    expect(component.form.invalid).toEqual(true);
    component.form.controls['email'].setValue('denis@gmail.com');
    expect(component.form.invalid).toEqual(false);
  });

  it('check register', () => {
    component.form.controls['firstName'].setValue('denis');
    component.form.controls['lastName'].setValue('ndjanda');
    component.form.controls['email'].setValue('notEmail');
    component.form.controls['password'].setValue('test!1234');
    component.form.controls['email'].setValue('denis@gmail.com');
    expect(component.form.invalid).toEqual(false);

    let spyAuthService = jest.spyOn(mockAuthService, 'register');
    let spyRouter = jest.spyOn(mockRouter, 'navigate');
    
    component.submit();

    const mockRequest = httpMock.expectOne('/api/auth/register');
    expect(mockRequest.request.method).toBe('POST');

    mockRequest.flush({})

    expect(spyAuthService).toHaveBeenCalledTimes(1);
    expect(spyRouter).toHaveBeenCalledTimes(1);
    expect(spyRouter).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toEqual(false);
  });

  it('check register', () => {
    component.form.controls['firstName'].setValue('denis');
    component.form.controls['lastName'].setValue('ndjanda');
    component.form.controls['email'].setValue('notEmail');
    component.form.controls['password'].setValue('test!1234');
    component.form.controls['email'].setValue('denis@gmail.com');
    expect(component.form.invalid).toEqual(false);

    let spyAuthService = jest.spyOn(mockAuthService, 'register');
    let spyRouter = jest.spyOn(mockRouter, 'navigate');
    
    component.submit();

    const mockRequest = httpMock.expectOne('/api/auth/register');
    expect(mockRequest.request.method).toBe('POST');

     mockRequest.flush('', {status: 401, statusText: 'Unauthorised!'});

    expect(spyAuthService).toHaveBeenCalledTimes(1);
    expect(spyRouter).toHaveBeenCalledTimes(0);
    expect(component.onError).toEqual(true);

    fixture.detectChanges();
    const errorMessage = document.getElementById('errorMes_register')!;
    expect(errorMessage.textContent).toContain('An error occurred');
  });
});
