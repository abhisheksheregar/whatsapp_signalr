import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-join',
  imports: [FormsModule, MatCardModule, MatInputModule, MatButtonModule],
  template: `
  <div class="center">
    <mat-card>
      <h2>Realtime Chat</h2>
      <mat-form-field appearance="outline">
        <input matInput [(ngModel)]="username" placeholder="Enter username">
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="join()">Join</button>
    </mat-card>
  </div>`
})
export class JoinComponent {
  username = '';
  constructor(private router: Router) {}
  join() {
    if (this.username.trim()) {
      localStorage.setItem('chatUser', this.username);
      this.router.navigate(['/chat']);
    }
  }
}