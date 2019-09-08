import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../pages/models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
   private url = 'https://identitytoolkit.googleapis.com/v1';
   private apiKey = 'AIzaSyAneXUvEFge2IE0meEwf3F-8Tbi_vm2RtU';
   
   userToken: string;
  //Crear usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

   

  //login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor( private http: HttpClient) { 
    this.leerToken();
  }

  logOut(){
    localStorage.removeItem('token');
  }

  logIn(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToke: true
    };
    return this.http.post(`${this.url}/accounts:signInWithPassword?key=${this.apiKey}`, authData)
    .pipe(
      map( resp => {
        console.log("Entro en el mapa del RXJS");
        this.guardarToken( resp['idToken']);
        return resp;
      })
    );

  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken() {
    
    if ( localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    
    return this.userToken;
  }

  nuevoUsuario(usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToke: true
    };

    return this.http.post(`${this.url}/accounts:signUp?key=${this.apiKey}`, authData)
    .pipe(
      map( resp => {
        console.log("Entro en el mapa del RXJS");
        this.guardarToken( resp['idToken']);
        return resp;
      })
    );
  }


  estaAutenticado(): boolean {
    if ( this.userToken.length < 2) {
      return false;
    }
    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);
    
    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }


    return this.userToken.length > 2 ;
  }
}
