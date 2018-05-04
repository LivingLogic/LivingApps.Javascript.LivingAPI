var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
let HomePage = class HomePage {
    constructor(navCtrl, laProv) {
        this.navCtrl = navCtrl;
        this.laProv = laProv;
        this.coffee = "Mocha";
        this.number = 1;
        this.consumer = "Der Herr des Kaffees";
    }
    changeNumber(diffrence) {
        if ((this.number <= 1 && diffrence < 0) || (this.number >= 5 && diffrence > 0)) {
            return;
        }
        this.number += diffrence;
    }
    add() {
        console.log("add entry" + JSON.stringify({
            kaffeesorte: this.coffee,
            runde: this.number,
            mitarbeiter: this.consumer
        }));
        this.laProv.addCoffee({
            kaffeesorte: this.coffee,
            runde: this.number.toString(),
            mitarbeiter: this.consumer
        }).then((res) => {
            alert("erfolgreich einen Datensatz hinzugefügt");
        });
    }
};
HomePage = __decorate([
    Component({
        selector: 'page-home',
        templateUrl: 'home.html'
    })
], HomePage);
export { HomePage };
