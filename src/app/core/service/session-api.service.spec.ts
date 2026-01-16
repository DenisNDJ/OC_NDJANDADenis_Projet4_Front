import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionApiService } from './session-api.service';
import { take } from 'rxjs';
import { Session } from '../models/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;

  let httpMock: HttpTestingController;

  const mockSession: Session = {
  id: 1,
  name: "Yoga du futur",
  description: "Le yoga du futur.",
  date: new Date(),
  teacher_id: 1,
  users: [],
  createdAt: new Date(),
  updatedAt: new Date()
  }

  const mockSessions: Session[] = [mockSession];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all session', () => {
    service.all().pipe(take(1)).subscribe((session)=>{
      expect(session).toEqual(mockSessions);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(httpMock);
  });

  it('should return one session by id', () => {
    let sessionId = "1";
    service.detail(sessionId).pipe(take(1)).subscribe((session)=>{
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/'+sessionId);
    expect(req.request.method).toBe('GET');
    req.flush(httpMock);
  });

  it('should delete one session', () => {
    let sessionId = "1";
    service.delete(sessionId).pipe(take(1)).subscribe((session)=>{
      expect(session).toBeNull();
    });
    const req = httpMock.expectOne('api/session/'+sessionId);
    expect(req.request.method).toBe('DELETE');
    req.flush(httpMock);
  });

  it('should create one session', () => {
    service.create(mockSession).pipe(take(1)).subscribe((session)=>{
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(httpMock);
  });  

  it('should update one session by id', () => {
    let sessionId = "1";
    service.update(sessionId, mockSession).pipe(take(1)).subscribe((session)=>{
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/'+sessionId);
    expect(req.request.method).toBe('PUT');
    req.flush(httpMock);
  }); 

  it('should add one participant from a session by id', () => {
    let sessionId = "1";
    let userId = "1";
    service.participate(sessionId, userId).pipe(take(1)).subscribe();
    const req = httpMock.expectOne('api/session/'+sessionId+"/participate/"+userId);
    expect(req.request.method).toBe('POST');
    req.flush(httpMock);
  });

  it('should remove a participant from a session by id', () => {
    let sessionId = "1";
    let userId = "1";
    service.unParticipate(sessionId, userId).pipe(take(1)).subscribe();
    const req = httpMock.expectOne('api/session/'+sessionId+"/participate/"+userId);
    expect(req.request.method).toBe('DELETE');
    req.flush(httpMock);
  });

});
