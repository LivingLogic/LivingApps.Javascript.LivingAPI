import { Injectable } from '@angular/core';

@Injectable()
export class LaProvider {
  private window: any;
  constructor() {
    this.window = window;
  }

  addCoffee (input) {
    return new Promise((resolve, reject) => {
      let lsdk = new this.window.livingSDK({},this.window.username, this.window.password);
      lsdk.get("appid of your Livingapp").then((LAAPI) => {
        let app = LAAPI.get('datasources').get('coffee').app;
        app.insert(input).then((res) => {
          console.log(res);
          resolve(res);
        })
      })
    });
  }

}
