import { Component, OnInit } from '@angular/core';
import { RestaurantService } from './services/restaurant.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnInit{
  title = 'FOODIEDELIGHT';
  isLoaded: boolean = false;
  constructor(private rest: RestaurantService,private login:LoginService) {

  }
  ngOnInit(): void {
    this.rest.resturantDataSubject.subscribe(() => {
      setTimeout(()=>{
        this.isLoaded = true;
      }, 800)
    });
    this.rest.loadRestaurantData();
    this.login.loadAllDemoUser();
  }
}
