import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Restaurant } from '../interface/restaurant';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  restaurantData: any;
  resturantDataSubject = new BehaviorSubject<Restaurant[]>([]);
  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  loadRestaurantData() {
    this.http
      .get<Restaurant[]>('/assets/data/restaurantsData.json')
      .subscribe((data) => {
        this.restaurantData = data;
        return this.resturantDataSubject.next(data);
      });
  }
  getTime(timeValue: any): string {
    if (timeValue && typeof timeValue == 'object') {
      return timeValue.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return timeValue;
  }

  waitingHomeRedirect(){
    setTimeout(()=>{
      this.router.navigate(['/admin/home']);
    },500);
  }

  addRestaurant(obj: Restaurant) {
    obj['id'] = uuidv4();
    obj['image'] = './assets/data/images/restaurants/res5.jpg';
    obj['close'] = this.getTime(obj['close']);
    obj['open'] = this.getTime(obj['open']);
    this.restaurantData = [...this.restaurantData, obj];
    this.resturantDataSubject.next(this.restaurantData);
    this.waitingHomeRedirect();
  }

  deleteRestaurant(id: string) {
    this.restaurantData = this.restaurantData.filter(
      (obj: Restaurant) => obj.id != id
    );
    this.resturantDataSubject.next(this.restaurantData);
  }

  updateRestaurant(rest: any, id: string) {
    let oldData = this.restaurantData.filter((obj: Restaurant) => obj.id == id)[0];

    let newdata = (this.restaurantData = this.restaurantData.filter(
      (obj: Restaurant) => obj.id != id
    ));
    oldData = [{...oldData, ...rest}];
    this.restaurantData = [...oldData, ...newdata]
    this.resturantDataSubject.next(this.restaurantData);
    this.waitingHomeRedirect();
  }

  getRestaurant(id: string) {
    return this.restaurantData.filter((obj: Restaurant) => obj.id == id)[0];
  }

  delete(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.deleteRestaurant(id);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Restaurant Deleted Succefully',
        });
        this.waitingHomeRedirect();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Deletion Cancelled',
          life: 3000,
        });
      },
    });
  }
}
