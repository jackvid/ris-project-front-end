import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
    token: string;
    userData;
    userLogin;

    constructor(private router: Router, private http: Http) {}

    signupUser(email: string, password: string, username: string) {
        
        this.userData = {
            username: username,
            password: password,
            email: email
        };

        this.http.post('http://127.0.0.1:8000/users/', this.userData).subscribe(
            response => {
                alert('USER ' + this.userData.username + ' has been created!')
                this.router.navigate(['/signin']);
            },
            error => {
                console.log('error', error)
            }
        );
    }

    signinUser(username: string, password: string) {
        
        this.userLogin = {
            username: username,
            password: password
        }

        this.http.post('http://127.0.0.1:8000/auth/', this.userLogin).subscribe(
            response => {
                let data = response.json();
                this.token = data;
                this.router.navigate(['/recipes']);
            },
            error => {
                alert("WRONG PASSWOR OR USERNAME");
            }

        );            
    }

    logout() {
        this.token = null;
        this.router.navigate(['/']);
    }

    getToken() {
        return this.token;
    }

    isAuthenticated() {
        return this.token != null;
    }
}