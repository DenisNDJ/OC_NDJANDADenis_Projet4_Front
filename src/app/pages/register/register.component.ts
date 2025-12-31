import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { RegisterRequest } from '../../core/models/registerRequest.interface';
import { MaterialModule } from "../../shared/material.module";
import { CommonModule } from "@angular/common";
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, MaterialModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy{
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private destroy$!: Subject<boolean>;
  public onError = false;

  public form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    firstName: [
      '',
      [
        Validators.required,
        Validators.min(3),
        Validators.max(20)
      ]
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.min(3),
        Validators.max(20)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.min(3),
        Validators.max(40)
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
    const registerRequest = this.form.value as RegisterRequest;
    this.authService.register(registerRequest).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_: void) => this.router.navigate(['/login']),
        error: _ => this.onError = true,
      }
    );
  }

}
