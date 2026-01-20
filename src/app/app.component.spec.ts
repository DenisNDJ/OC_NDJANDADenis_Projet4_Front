import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { AppComponent } from './app.component';
import { SessionService } from './core/service/session.service';
import { Router } from '@angular/router';
import { of, take } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let mockSessionService = {
    $isLogged: jest.fn(()=>of(true)),
    logOut: jest.fn()
  };

  let mockRouter ={
    navigate: jest.fn(),
  } 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule,
        AppComponent
      ],
      providers: [
        {provide:SessionService,useValue:mockSessionService},
        {provide:Router,useValue:mockRouter},
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should return login status', () => {
    component.$isLogged().pipe(take(1)).subscribe((logData)=>{
    expect(logData).toBe(true);
    expect(mockSessionService.$isLogged).toHaveBeenCalledTimes(1);
    })
  });

  it('should logout', () => {
    component.logout();
    expect(mockSessionService.$isLogged).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
