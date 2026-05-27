import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalrService } from '../signalr.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentUser = localStorage.getItem('chatUser') || '';

  receiver = '';
  message = '';
  selected = '';

  chats: Record<string, { text: string; mine: boolean }[]> = {};

  unread: Record<string, number> = {};

  constructor(public signalr: SignalrService) {}

  async ngOnInit() {

    const user = localStorage.getItem('chatUser')!;

    await this.signalr.startConnection(user);

    console.log('CONNECTED');

    this.signalr.onMessage((sender: any, msg: any) => {

      console.log('RECEIVED', sender, msg);

      // create chat array
      if (!this.chats[sender]) {
        this.chats[sender] = [];
      }

      // add received message
      this.chats[sender].push({
        text: msg,
        mine: false
      });

      // auto open sender chat
      this.selected = sender;
      this.receiver = sender;

      // unread
      if (this.selected !== sender) {
        this.unread[sender] = (this.unread[sender] || 0) + 1;
      }

      // refresh ui
      this.chats = { ...this.chats };
    });
  }

  open(user: string) {

    this.selected = user;
    this.receiver = user;

    this.unread[user] = 0;
  }

  async send() {

    if (!this.receiver || !this.message) {
      return;
    }

    // create receiver chat
    if (!this.chats[this.receiver]) {
      this.chats[this.receiver] = [];
    }

    // add own message
    this.chats[this.receiver].push({
      text: this.message,
      mine: true
    });

    // send to signalr
    await this.signalr.send(
      this.receiver,
      this.currentUser,
      this.message
    );

    // keep current chat open
    this.selected = this.receiver;

    // refresh ui
    this.chats = { ...this.chats };

    // clear message
    this.message = '';
  }

  users() {
    return Object.keys(this.chats);
  }
}