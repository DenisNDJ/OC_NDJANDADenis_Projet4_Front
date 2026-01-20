import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/core/service/session.service';
import { expect } from '@jest/globals';
import { MeComponent } from './me.component';
import { of, Subject, take } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/service/user.service';
import { User } from 'src/app/core/models/user.interface';

describe('MeComponent', () => {
  
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  const matSnackBarMock = {
    open: jest.fn()
  };

  const mockUser: User = {
        id: 1,
        email: 'denis@gmail.com',
        lastName: 'ndjanda',
        firstName: 'denis',
        admin: true,
        password: 'test!1234',
        createdAt: new Date("January 17, 2026 11:11:11"),
        updatedAt: new Date("January 17, 2026 11:11:11"),
      }

  let userServiceMock = {
    delete: jest.fn(()=>of({})),
    getById: jest.fn(()=>of(mockUser))
  };

  let mockRouter: Router;

  let mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn()
  }

  const windNavMock ={
    back: jest.fn()
  }

  beforeEach(async () => {
    TestBed.overrideComponent(MeComponent, {
      set: { providers: [{ provide: MatSnackBar, useValue: matSnackBarMock }] },
    });
    
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MeComponent
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: userServiceMock },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        Router,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the back method when button clicked', () => {
    let spyWindow = jest.spyOn(window.history, 'back');
    const button = document.getElementById('backBtn_me')!;
    button.click();

    expect(spyWindow).toHaveBeenCalledTimes(1);
  });

  it('should delete the user', () => {

    let spyRouter = jest.spyOn(mockRouter, 'navigate');
    let spyUserServ = jest.spyOn(userServiceMock, 'delete');
    let spySesServ = jest.spyOn(mockSessionService, 'logOut');
    let spySnack = jest.spyOn(matSnackBarMock, 'open');

    component.delete();

    expect(spyUserServ).toHaveBeenCalledTimes(1);
    expect(spySesServ).toHaveBeenCalledTimes(1);
    expect(spyRouter).toHaveBeenCalledTimes(1);
    expect(spyRouter).toBeCalledWith(['/']);
    expect(spySnack).toHaveBeenCalledTimes(1);
  });

  it('check the user info and the user', () => {
    const nameElement = document.getElementById('name_me')!;
    const adminElement = document.getElementById('admin_me')!;
    const emailElement = document.getElementById('email_me')!;
    const creaElement = document.getElementById('createdAt_me')!;
    const updElement = document.getElementById('updateAt_me')!;

    expect(nameElement.textContent).toContain('denis');
    expect(nameElement.textContent).toContain('ndjanda'.toUpperCase());
    expect(adminElement.textContent).toContain('You are admin');
    expect(emailElement.textContent).toContain('denis@gmail.com');
    expect(creaElement.textContent).toContain("January 17, 2026");
    expect(updElement.textContent).toContain("January 17, 2026");

  });
});
