import * as signalR from '@microsoft/signalr';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;

  async startConnection(user: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://signalr-practice.onrender.com/realtimehub?user=${user}`)
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      console.log('Connected');
    } catch (err) {
      console.error(err);
    }
  }

  async send(receiver: string, sender: string, message: string) {
    if (
      !this.hubConnection ||
      this.hubConnection.state !== signalR.HubConnectionState.Connected
    ) {
      console.log('SignalR not connected yet');
      return;
    }

    await this.hubConnection.invoke(
      'SendPrivateMessage',
      receiver,
      sender,
      message
    );
  }

  onMessage(callback: any) {
    this.hubConnection.on(
      'ReceiveMessage',
      (sender: string, message: string) => {
        callback(sender, message);
      }
    );
  }
}