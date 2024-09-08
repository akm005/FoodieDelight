import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Restaurant } from '../../interface/restaurant';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.scss',
})
export class RestaurantComponent implements OnInit {
  @Input() id = '';
  form!: FormGroup;
  files = [];
  isInvalid: boolean = false;
  totalSize: number = 0;

  totalSizePercent: number = 0;

  types = [
    { name: 'VEG', code: 'VEG' },
    { name: 'NONVEG', code: 'NVEG' },
    { name: 'VEG+NONVEG', code: 'VEGNV' },
    { name: 'VEGAN', code: 'VG' },
    { name: 'JAIN', code: 'JN' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private restService: RestaurantService,
    private messageService: MessageService,
    private config: PrimeNGConfig
  ) {}

  get control() {
    return this.form.controls;
  }

  ngOnInit(): void {
    let data!: Restaurant;
    if (this.id) {
      data = this.restService.getRestaurant(this.id);
    }

    if (this.id && !data) {
      this.messageService.add({
        severity: 'error',
        summary: 'Resturant Not Found',
        detail: `Redirecting to home`,
      });

      setTimeout(() => {});
    }
    this.form = this.fb.group({
      name: [data?.name ?? '', [Validators.required, Validators.minLength(3)]],
      email: [data?.email ?? '', [Validators.required, Validators.email]],
      description: [data?.description ?? '', [Validators.required]],
      contact: [data?.contact ?? '', [Validators.required]],
      address: [data?.address ?? '', [Validators.required]],
      city: [data?.city ?? '', [Validators.required]],
      state: [data?.state ?? '', [Validators.required]],
      zip: [data?.zip ?? '', [Validators.required]],
      open: [data?.open ?? '', [Validators.required]],
      close: [data?.close ?? '', [Validators.required]],
      type: [data?.type ?? '', [Validators.required]],
      rating: [data?.rating ?? 0, [Validators.required]],
      tags: [data?.tags ?? [], [Validators.required]],
      active: [data?.active ?? true, [Validators.required]],
    });
  }

 
  onSubmit() {
    if (this.form.valid) {
      this.isInvalid = false;
      if (!this.id) {
        this.restService.addRestaurant(this.form.value);

        this.messageService.add({
          severity: 'success',
          summary: 'Resturant Added',
          detail: `Resturant Object Created With Name ${this.form.value['name']}`,
        });
      } else {
        this.restService.updateRestaurant(this.form.value, this.id);

        this.messageService.add({
          severity: 'success',
          summary: 'Resturant Updated',
          detail: `Resturant Object Created With Name ${this.form.value['name']}`,
        });
      }
    } else {
      this.isInvalid = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Resturant Not Added',
        detail: `Resturant Data Not Valid Check Validation Error`,
      });
    }
  }

  delete(event: Event) {
    this.restService.delete(event, this.id);
  }

  choose(event: any, callback: any) {
    callback();
  }

  onRemoveTemplatingFile(
    event: any,
    file: any,
    removeFileCallback: any,
    index: any
  ) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000,
    });
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file: any) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: any) {
    callback();
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes: any = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }
}
