import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'], 
})
export class HomeComponent implements OnInit {
  restaurantData: any = [];
  displayedData: any = []; 
  first: number = 0; 
  rows: number = 5; 

  constructor(private rest: RestaurantService) {}

  ngOnInit() {
    this.rest.resturantDataSubject.subscribe((data) => {
      this.restaurantData = data;
      this.updateDisplayedData(); 
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updateDisplayedData();
  }

  // Update the data to be displayed based on the current page
  updateDisplayedData() {
    this.displayedData = this.restaurantData.slice(this.first, this.first + this.rows);
  }
}
