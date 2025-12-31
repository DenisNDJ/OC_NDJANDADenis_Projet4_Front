import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionInformation } from 'src/app/core/models/sessionInformation.interface';
import { SessionService } from 'src/app/core/service/session.service';
import { LoginRequest } from '../../core/models/loginRequest.interface';
import { AuthService } from '../../core/service/auth.service';
import {MaterialModule} from "../../shared/material.module";
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private sessionService = inject(SessionService);
  private destroy$!: Subject<boolean>;
  
  public hide = true;
  public onError = false;

  public form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.min(3)
      ]
    ]
  });

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public submit(): void {
    const loginRequest = this.form.value as LoginRequest;
    this.authService.login(loginRequest).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: SessionInformation) => {
        this.sessionService.logIn(response);
        this.router.navigate(['/sessions']);
      },
      error: error => this.onError = true,
    });
  }
}
