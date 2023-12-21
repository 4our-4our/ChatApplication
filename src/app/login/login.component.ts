import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validator, Form, Validators } from '@angular/forms';
import { SupabaseService } from '../service/supabase.service';
import { Router } from '@angular/router';
import { UserService } from '../service/userService.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    public loggedInUser!: string;

    constructor(private formBuilder: FormBuilder, private auth: SupabaseService,private routes: Router,private userName:UserService){
      this.loginForm = this.formBuilder.group({
        email:formBuilder.control('',[Validators.required,Validators.email,Validators.minLength(5)]),
        password:formBuilder.control('',[Validators.required,Validators.minLength(8)]),
      })     
    }
    ngOnInit(): void {
      console.log(this.loginForm);
    }
    
    public onSubmit(){
      const data = this.auth.signIn(this.loginForm.value.email,this.loginForm.value.password);
      console.log(data);
      data.subscribe((wholeData:any)=>{
        this.loggedInUser = wholeData.data.user.email;
        this.userName.loggedInUser = this.loggedInUser
        this.routes.navigate(['/chat']);
      });
  }

}
