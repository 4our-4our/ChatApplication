import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../service/supabase.service';
import { UserService } from '../service/userService.service';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  @ViewChild('contentTxt') contentTxt!: ElementRef;
  public Users:any[] = [];
  public selectedUser: any;
  public showChatWindow = false;
  public messages = [];
  public messages1 = [];
  public combinedMessages: any;
  public sortedMessages: any;
  public curUser: any;
  public curUserId : any;
  public msgContent! :string;
  
  constructor(private auth: SupabaseService, private userService: UserService){}
  ngOnInit(): void {
    this.fetchAllUsers();
    this.curUser = this.userService.loggedInUser;
    this.getUserId(this.curUser);
}

  // openChat(user:any){
  //   this.fetchMessages(this.curUserId,user.id);
  //   this.fetchMessagesPart2(this.curUserId,user.id)
  //   this.selectedUser = user;
  //   this.showChatWindow = true;
  //   this.combinedMessages = [...this.messages,...this.messages1]
  //   this.combinedMessages.sort((a: { timestamp: number; },b: { timestamp: number; })=>a.timestamp - b.timestamp)
  //   console.log(this.combinedMessages);
  //   console.log(this.sortedMessages);
  //   this.sortedMessages = this.combinedMessages;
  // }
  // Assuming fetchMessages and fetchMessagesPart2 return promises

  async openChat(user: any) {
    try {
        this.fetchMessages(this.curUserId, user.id),
        this.fetchMessagesPart2(this.curUserId, user.id)
        this.selectedUser = user;
        this.showChatWindow = true;
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  mergingMsg(){
    this.combinedMessages = [...this.messages, ...this.messages1];
    this.combinedMessages.forEach((message: { timestamp: string | number | Date; }) => {
      message.timestamp = new Date(message.timestamp);
  });
    console.log('combined msg',this.combinedMessages);
    this.combinedMessages = this.combinedMessages.sort((a:any,b:any) => a.timestamp - b.timestamp);
    this.sortedMessages = this.combinedMessages;
    console.log('sorted msg',this.sortedMessages);
  }
  
  closeChat(){
    this.selectedUser = null;
    this.showChatWindow = false;
  }
  getUserId(email:string){
    const data = this.auth.getUserIdfromEmail(email);
    data.subscribe((wholeData:any)=>{
      this.curUserId = wholeData.data[0].id;
      console.log(this.curUserId);
    })
    console.log(data);
  }
  fetchMessages(senderId:number,receiverId:number){
      const data = this.auth.fetchUserMessages(senderId,receiverId);
      // this.messages = data;
      data.subscribe((wholeData: any) =>{
        this.messages = wholeData.data;
        this.combinedMessages = this.messages;
        console.log('chat',this.messages);
        this.mergingMsg();
      });
  }
  fetchMessagesPart2(senderId:number,receiverId:number){
    const data = this.auth.fetchUserMessages2(receiverId,senderId);
      // this.messages1 = data;
      data.subscribe((wholeData: any) =>{
        this.messages1 = wholeData.data;
        console.log('chat2',this.messages1);
        this.mergingMsg();
      });
  }
  signItOut(){
    this.auth.signOut();
  }
  async fetchAllUsers(){
    await this.auth.getAllUsers();
    this.Users =  this.auth.users;
    console.log('userData',this.Users);
  }
  postMessages(senderId:number,receiverId:number){
    this.msgContent = this.contentTxt.nativeElement.value;
    this.auth.postMessage(senderId,receiverId,this.msgContent).then(()=>{
      this.fetchMessages(senderId,receiverId);
      this.fetchMessagesPart2(senderId,receiverId);
      this.contentTxt.nativeElement.value = null;
    })
  }


}

