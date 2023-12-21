import { Injectable, Output } from '@angular/core';
import { AuthChangeEvent, AuthError, AuthResponse, AuthTokenResponse, PostgrestResponse, Session, SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, from, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase_client: SupabaseClient
  private _currentUser: BehaviorSubject<boolean | User | any> = new BehaviorSubject(null)
  public users: any=[];
  public userName: any;

  constructor(private routes: Router) { 
    this.supabase_client = createClient(environment.supabaseKeys.url, environment.supabaseKeys.key)

    const user = this.supabase_client.auth.getUser()
    if (user) {
      this._currentUser.next(user)
      console.log(user);
    } else {
      this._currentUser.next(false)
    }
  }

  //Register
  async signUp(email: string, password: string): Promise<any>{
  const { data, error } = await this.supabase_client.auth.signUp({
    email,
    password,
  })
  let userEmail = data.user?.email;
  if(data){
    const { error } = await this.supabase_client
    .from('users')
    .insert({ email: userEmail })
  }
  this.routes.navigate(['/login']);
  console.log("SignUp successful");
  return data;
  } 

  async insertUser(email: string){
    const {data,error} = await this.supabase_client
    .from('users')
    .insert({email: email});
  }

  signOut(){
    try{
      this.supabase_client.auth.signOut;
      console.log("Signout successful");
      this.routes.navigate(['/login']);
    }
    catch(ex:any){
      console.log(ex.Message);
    }

  }

  //signIn
  // async signIn(email:string, password:string){
  //   const {data} = await this.supabase_client.auth.signInWithPassword({email,password});
  //   this.userName = data.user?.email;
  //   console.log('login info',this.userName);
  //   this.routes.navigate(['/chat']);
  // }


  //GetAllTheUsers
  async getAllUsers(): Promise<any> {
    try{
      const {data,error} = await this.supabase_client
    .from('users')
    .select()

    if(error){
      return null;
    }
    this.users = data;
    console.log('supabaseusers',this.users);
    return data;
    }
    catch(ex:any){
      console.log(ex.Message);
      return null;
    }
  }
  
fetchUserMessages(senderId:number,receiverId:number): Observable<any>{
    try{
      return from(
        this.supabase_client
          .from('messages')
          .select('sender_id, content, timestamp')
          .eq('sender_id',senderId)
          .eq('receiver_id',receiverId)
      );
    }
    catch(ex:any){
      console.log(ex.Message);
      return throwError(Error);
    }
  }
  fetchUserMessages2(senderId:number,receiverId:number): Observable<any>{
    try{
      return from(
        this.supabase_client
          .from('messages')
          .select('sender_id, content, timestamp')
          .eq('sender_id',senderId)
          .eq('receiver_id',receiverId)
      );
    }
    catch(ex:any){
      console.log(ex.Message);
      return throwError(Error);
    }
  }
  signIn(email: string, password: string): Observable<any> {
    return from(
      this.supabase_client.auth.signInWithPassword({ email, password })
    )
  }
  getUserIdfromEmail(email:string): Observable<any> {
    return from(
      this.supabase_client
      .from('users')
      .select('id')
      .eq('email',email)
    )
  }
  async postMessage(senderId:number,receiverId:number,content:string){
     const {error} = await this.supabase_client
    .from('messages')
    .insert({sender_id:senderId, receiver_id:receiverId, content: content})
    .select()
    if(error){
      console.log(error);
      
    }
  }
}


