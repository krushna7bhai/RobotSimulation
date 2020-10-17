import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // for application configuration
  public config:any;
  constructor(public navCtrl: NavController) {
    this.config = {
      x: 0,
      y: 0,
      f: 'North', 
      nextMoveBy: 1, // move will increment by specified by
      xAxisUnits: 5, // Unit value is 5 if table unit dimention change then make changes here,  rest code will remain same
      yAxisUnits: 5,  // Unit value is 5 if table unit dimention change then make changes here,  rest code will remain same
    }
    this.resetReport();
  }
  /**
   * Reset report data
   */
  resetReport(){
    this.config.report = 'Robot is not on the table';
    this.config.bondaryLimit = { // specifing default boundary limit of table.
      north: this.config.yAxisUnits - 1, 
      south: 0,
      east: this.config.xAxisUnits - 1,
      west: 0
    }
  }

  /**
   * reset old report & place the robot on table 
   */
  placeRobot() {
    this.resetReport();
    if(this.config.x > -1 && this.config.x < this.config.xAxisUnits && this.config.y > -1 && this.config.y < this.config.yAxisUnits) { 
      this.config.report = `Placed => ${this.config.x} , ${this.config.y} , ${this.config.f}`
    }
  }

  /**
   * Rorate the robot in left to right or vise varsa
   * @param direction : indicates in which direction robot to be rotate
   */
  rotateRobot(direction:any) {
    // Robot is not placed on the table so discarding all commands
    if(this.config.report.indexOf('not on the table') >-1) return;

    switch(this.config.f){
      case "North":
        this.config.f= direction == 'left' ? 'West' : 'East';
        break;
      
      case "South":
        this.config.f= direction == 'left' ? 'East' : 'West';
        break;
      
      case "East":
        this.config.f= direction == 'left' ? 'North' : 'South';
        break;
      
      case "West":
        this.config.f= direction == 'left' ? 'South' : 'North';
        break;
    }
    this.config.report += `\nTurned ${direction} => ${this.config.x} ,  ${this.config.y} , ${this.config.f}`;
  }

  /**
   * Moving robot to next location
   * valid and invalid move calculation logic done in below code (basically we are checking here for boundaries ,if move crosses broundry then we are showing invalid move and robot will not be move.)
   * 'Invalid Move' - Robot would be fall so preventing robot and hance mentioned invalid move in log / output
   */
  moveToNextPlace() {
    // Robot is not placed on the table so discarding all commands
    if(this.config.report.indexOf('not on the table') >-1) return;
    const invalidMoveMsg = 'Invalid Move: Can not move, current position '
    let message = 'Moved';
    switch(this.config.f){
      case "North":
        (Number(this.config.y) + this.config.nextMoveBy > this.config.bondaryLimit.north) ?
          message = invalidMoveMsg :
            this.config.y = Number(this.config.y) + this.config.nextMoveBy;
        break;
      
      case "South":
        (Number(this.config.y) - this.config.nextMoveBy < this.config.bondaryLimit.south) ?
          message = invalidMoveMsg : 
            this.config.y = Number(this.config.y) - this.config.nextMoveBy;
        break;
      
      case "East":
        (Number(this.config.x) + this.config.nextMoveBy > this.config.bondaryLimit.east) ? 
          message = invalidMoveMsg : 
            this.config.x  = Number(this.config.x) + this.config.nextMoveBy;
        break;
      
      case "West":
        (Number(this.config.x) - this.config.nextMoveBy < this.config.bondaryLimit.west) ?
          message = invalidMoveMsg : 
          this.config.x = Number(this.config.x) - this.config.nextMoveBy;
        break;
    }
    this.config.report += `\n${message} => ${this.config.x} ,  ${this.config.y} , ${this.config.f}`;

  }

}
