import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validator, Form, Validators } from '@angular/forms';
import { SupabaseService } from '../service/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signUpForm!: FormGroup;

  
  constructor(private formBuilder: FormBuilder, private auth: SupabaseService){
    this.signUpForm = this.formBuilder.group({
      email:formBuilder.control('',[Validators.required,Validators.email,Validators.minLength(5)]),
      password:formBuilder.control('',[Validators.required,Validators.minLength(3)]),
    })   
  }
  ngOnInit(): void {
  }
  
  public onSubmit() {
      this.auth.signUp(this.signUpForm.value.email, this.signUpForm.value.password);
  }

}
