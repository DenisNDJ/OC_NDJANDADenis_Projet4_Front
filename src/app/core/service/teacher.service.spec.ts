import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take } from 'rxjs';
import { Teacher } from '../models/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;

  let httpMock: HttpTestingController;

  const mockTeacher: Teacher ={
  id: 1,
  lastName: "ndjanda",
  firstName: "denis",
  createdAt: new Date(),
  updatedAt: new Date(),
  }

  const mockTeachers: Teacher[] = [mockTeacher];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all teachers', () => {
    service.all().pipe(take(1)).subscribe((teacher)=>{
      expect(teacher).toEqual(mockTeachers);
    });
    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(httpMock);
  });

  it('should return a teacher by ID', () => {
    let teacherId = "1";
    service.detail(teacherId).pipe(take(1)).subscribe((teacher)=>{
      expect(teacher).toEqual(mockTeacher);
    });
    const req = httpMock.expectOne('api/teacher/'+teacherId);
    expect(req.request.method).toBe('GET');
    req.flush(httpMock);
  });
});
