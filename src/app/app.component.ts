import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { ChatComponent } from './chat/chat.component';
import { NotificationComponent } from './notification/notification.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, LoginComponent, ChatComponent, NotificationComponent]
})
export class AppComponent implements OnInit{
  constructor(public router:Router){}
  title = 'chatAppAzure';
  ngOnInit(): void {
    
  }
}
