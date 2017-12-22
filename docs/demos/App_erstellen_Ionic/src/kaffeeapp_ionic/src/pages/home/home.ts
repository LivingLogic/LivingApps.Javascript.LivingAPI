import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LaProvider }from '../../providers/la/la';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private coffee: any = "Mocha";
  private number: number = 1;
  private consumer: any = "Der Herr des Kaffees";
  constructor(public navCtrl: NavController, private laProv: LaProvider) {


  }
  changeNumber (diffrence: number) {
    if ((this.number <= 1 && diffrence < 0) || (this.number >= 5 && 	diffrence > 0)) {
        return;
      }
      this.number += diffrence;
    }


    add(){
      console.log("add entry" + JSON.stringify({
        kaffeesorte: 	this.coffee,
        runde: this.number,
        mitarbeiter: this.consumer
      }));
      this.laProv.addCoffee({
        kaffeesorte: 	this.coffee,
        runde: this.number.toString(),
        mitarbeiter: this.consumer
      }).then((res)=>{
        alert("erfolgreich einen Datensatz hinzugefügt");
      });
    }

}
