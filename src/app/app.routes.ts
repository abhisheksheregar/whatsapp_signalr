import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { JoinComponent } from './join/join.component';

export const routes: Routes = [
    { path: '', component: JoinComponent },
    { path: 'chat', component: ChatComponent }
];
