import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import { SessionInformation } from '../models/sessionInformation.interface';
import { take } from 'rxjs';

describe('SessionService', () => {
  let service: SessionService;

  const mockSessionInformation: SessionInformation = {
  token: "token",
  type: "Bearer",
  id: 1,
  username: "denis@gmail.com",
  firstName: "denis",
  lastName: "ndjanda",
  admin: true,
}

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check if logged', () => {
    service.$isLogged().pipe(take(1)).subscribe((logged)=>{
      expect(service.isLogged).toEqual(false);
      expect(service.sessionInformation).toEqual(undefined);
    })
  });

  it('check login', () => {
    service.logIn(mockSessionInformation);
    expect(service.isLogged).toEqual(true);
    expect(service.sessionInformation).toEqual(mockSessionInformation);

    service.$isLogged().pipe(take(1)).subscribe((logged)=>{
      expect(service.isLogged).toEqual(true);
      expect(service.sessionInformation).toEqual(mockSessionInformation);
    })
  });

  it('check logout', () => {
    service.logIn(mockSessionInformation);
    expect(service.isLogged).toEqual(true);
    expect(service.sessionInformation).toEqual(mockSessionInformation);

    service.logOut();
    expect(service.isLogged).toEqual(false);
    expect(service.sessionInformation).toEqual(undefined);

    service.$isLogged().pipe(take(1)).subscribe((logged)=>{
      expect(service.isLogged).toEqual(false);
      expect(service.sessionInformation).toEqual(undefined);
    })
  });
});
