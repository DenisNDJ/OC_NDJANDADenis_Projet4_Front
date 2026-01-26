import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../core/service/session.service';
import { DetailComponent } from './detail.component';
import { Session } from 'src/app/core/models/session.interface';
import { of } from 'rxjs';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { Teacher } from 'src/app/core/models/teacher.interface';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/core/service/teacher.service';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  
  let mockRouter: Router;

  const mockSnackBar = {
    open:jest.fn()
  }

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

  const mockTeacher: Teacher = {
  id: 1,
  lastName: "NDJANDA",
  firstName: "Denis",
  createdAt: new Date(),
  updatedAt: new Date(),
  }

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }
  
  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSessionData)),
    delete: jest.fn().mockReturnValue(of({})),
    participate: jest.fn().mockReturnValue(of({})),
    unparticipate: jest.fn().mockReturnValue(of({})),
  }
  
  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of(mockTeacher)),
  }

  beforeEach(async () => {

    TestBed.overrideComponent(DetailComponent, {
      set: { providers: [{ provide: MatSnackBar, useValue: mockSnackBar }] },
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        DetailComponent,
        RouterTestingModule,
      ],
      providers: [
        Router,
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },],
        
    }).compileComponents();

    mockSessionService.sessionInformation.admin = true;
    mockSessionData.users = [];

    fixture = TestBed.createComponent(DetailComponent);
    mockRouter = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the back method when button clicked', () => {
    let spyBack = jest.spyOn(window.history, 'back');
    const button = document.getElementById('backBtn_detail')!;
    button.click();

    expect(spyBack).toHaveBeenCalledTimes(1);
  });

  it('test the delete button', () => {
    let spyDelete = jest.spyOn(component,'delete');
    let spyRoute = jest.spyOn(mockRouter,'navigate');
    let spySnack = jest.spyOn(mockSnackBar,'open');
    expect(document.getElementById('sessionDeleteBtn_detail')).not.toBeNull;
    const button = document.getElementById('sessionDeleteBtn_detail')!;
    button.click();
    
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(spyRoute).toHaveBeenCalledTimes(1);
    expect(spySnack).toHaveBeenCalledTimes(1);
    expect(spyRoute).toBeCalledWith(['sessions']);
  });

  it('test the delete button when admin and not', () => {

    expect(document.getElementById('sessionDeleteBtn_detail')).not.toBeNull;

    mockSessionService.sessionInformation.admin = false;
    fixture.detectChanges();

    expect(document.getElementById('sessionDeleteBtn_detail')).toBeNull;
  });

  it('check the details', () => {
    expect(document.getElementById('sessionName_detail')?.textContent).toContain("Yoga Du Soir");
    expect(document.getElementById('sessionDescription_detail')?.textContent).toContain(mockSessionData.description);
    expect(document.getElementById('sessionTeacher_detail')?.textContent).toContain(mockTeacher.firstName);
    expect(document.getElementById('sessionTeacher_detail')?.textContent).toContain(mockTeacher.lastName);
    let nbrPat = mockSessionData.users.length.toString();
    expect(document.getElementById('sessionNbrParticipant_detail')?.textContent).toContain(nbrPat);
  });

  it('test the participation button', () => {

    expect(document.getElementById('sessionParticipateBtn_detail')).toBeNull;
    expect(document.getElementById('sessionUnparticipateBtn_detail')).toBeNull;

    mockSessionService.sessionInformation.admin = false;
    fixture.detectChanges();

    expect(document.getElementById('sessionParticipateBtn_detail')).not.toBeNull;
    expect(document.getElementById('sessionUnparticipateBtn_detail')).toBeNull;

    mockSessionData.users = [1];
    fixture.detectChanges();

    expect(document.getElementById('sessionParticipateBtn_detail')).toBeNull;
    expect(document.getElementById('sessionUnparticipateBtn_detail')).not.toBeNull;
  });

});

