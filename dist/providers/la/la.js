var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
let LaProvider = class LaProvider {
    constructor() {
        this.window = window;
    }
    addCoffee(input) {
        return new Promise((resolve, reject) => {
            let lsdk = new this.window.livingSDK({}, this.window.username, this.window.password);
            lsdk.get("appid of your Livingapp").then((LAAPI) => {
                let app = LAAPI.get('datasources').get('coffee').app;
                app.insert(input).then((res) => {
                    console.log(res);
                    resolve(res);
                });
            });
        });
    }
};
LaProvider = __decorate([
    Injectable()
], LaProvider);
export { LaProvider };
