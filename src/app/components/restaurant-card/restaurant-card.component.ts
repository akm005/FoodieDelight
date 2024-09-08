import { Component, Input, OnInit } from '@angular/core';
import { Restaurant } from '../../interface/restaurant';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.scss',
})
export class RestaurantCardComponent implements OnInit {
  constructor(
    private router: Router,
    private resService: RestaurantService,
    private loginServ:  LoginService

  ) {}
  isLoading: boolean = true;
  isLogin!: boolean;
  isDeleting: boolean = false;

  @Input({ required: true }) resData!: Restaurant;

  ngOnInit(): void {
    this.loginServ.isloggedInSubject.subscribe((d)=>{
      this.isLogin = d
    })
    setTimeout(() => {
      this.isLoading = false;
    }, 550);
  }

  edit() {
    this.router.navigate([`/admin/restaurant/edit/${this.resData.id}`]);
  }

  delete(event: Event) {
    this.resService.delete(event, this.resData.id);
  }

  onLoad() {
    this.isLoading = false;
  }
}
