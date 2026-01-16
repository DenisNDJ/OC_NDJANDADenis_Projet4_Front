import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { User } from '../models/user.interface';
import { take } from 'rxjs';

describe('UserService', () => {
  let service: UserService;

  let httpMock: HttpTestingController;

  const mockUser: User ={
  id: 1,
  email: "denis@gmail.com",
  lastName: "ndjanda",
  firstName: "denis",
  admin: true,
  password: "test!1234",
  createdAt: new Date(),
  updatedAt: new Date,
} 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return one user by id', () => {
    let userId = "1";
    service.getById(userId).pipe(take(1)).subscribe((user)=>{
      expect(user).toEqual(mockUser);
    });
    const req = httpMock.expectOne('api/user/'+userId);
    expect(req.request.method).toBe('GET');
    req.flush(httpMock);
  });

  it('should delete one user', () => {
    let userId = "1";
    service.delete(userId).pipe(take(1)).subscribe((teacher)=>{
      expect(teacher).toBeNull();
    });
    const req = httpMock.expectOne('api/user/'+userId);
    expect(req.request.method).toBe('DELETE');
    req.flush(httpMock);
  });
});
