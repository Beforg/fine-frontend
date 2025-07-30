import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterForm, RegisterFormData } from '../../interfaces/register-form.interface';

@Component({
  selector: 'app-form-register',
  imports: [],
  templateUrl: './form-register.component.html',
  styleUrl: './form-register.component.scss'
})
export class FormRegisterComponent implements OnInit, OnDestroy{

  registerForm?: FormGroup<RegisterForm>;

  isLoading = false;
  isSubmitted = false;

  @Output() formSubmit = new EventEmitter<RegisterFormData>();
  @Output() formCancel = new EventEmitter<void>();


  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    
  }
 // Método para submeter o formulário
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group<RegisterForm>({
      nome: this.fb.control('', // Nome
        {validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ], nonNullable: true}),
      email: this.fb.control('', // Email
        {validators: [
          Validators.required,
          Validators.email
        ], nonNullable: true}),
      telefone: this.fb.control('', // Telefone
        {validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15)
        ], nonNullable: true}),
      senha: this.fb.control('', // Senha
        {validators: [
          Validators.required,
          Validators.minLength(6)
        ], nonNullable: true}),
      confirmarSenha: this.fb.control('', // Confirmar Senha
        {validators: [
          Validators.required,
          Validators.minLength(6)
        ], nonNullable: true})
    }) as FormGroup<RegisterForm>;
  }



}
