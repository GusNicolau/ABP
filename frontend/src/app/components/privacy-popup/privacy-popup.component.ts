import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-popup',
  templateUrl: './privacy-popup.component.html',
  styleUrls: ['./privacy-popup.component.css']
})
export class PrivacyPopupComponent implements OnInit {
  showPopup: boolean = true;
  showAccessDeniedMessage: boolean = false;

  showAccessDeniedMessageSettings: boolean = false;

  showPrivacySettings: boolean = false;

  privacySettings = {
    tracking: false,
    personalization: false
  };


  constructor() { }

  ngOnInit(): void {
    const accepted = localStorage.getItem('privacyAccepted');
    const rejected = localStorage.getItem('privacyRejected');
    const setting= localStorage.getItem('privacySettings');


    if (setting) {
      this.privacySettings = JSON.parse(setting);

      if(this.privacySettings.personalization == false && this.privacySettings.tracking == false){

        this.showAccessDeniedMessageSettings = true;
        this.showPopup = false;

      }

      else{
        this.showPopup = false;
      }
    }

    if (accepted) {
      this.showPopup = false;
    } else if (rejected) {
      this.showAccessDeniedMessage = true;
      this.showPopup = false;
    }
  }

  acceptPrivacyPolicy(): void {
    localStorage.setItem('privacyAccepted', 'true');
    this.privacySettings.tracking = true;
    this.privacySettings.personalization = true;

    localStorage.removeItem('privacyRejected');
    localStorage.removeItem('privacySettings');

    this.showPopup = false;
    this.showAccessDeniedMessage = false;
    this.showAccessDeniedMessageSettings = false;
  }

  rejectPrivacyPolicy(): void {
    localStorage.setItem('privacyRejected', 'true');

    localStorage.removeItem('privacySettings');
    localStorage.removeItem('privacyAccepted');

    this.showPopup = false;
    this.showAccessDeniedMessageSettings = false;
    this.showAccessDeniedMessage = true;
  }

  reconsiderPrivacyPolicy(): void {
    this.showAccessDeniedMessage = false;
    this.showPopup = true;
  }

  openPrivacySettings(): void {
    this.showPrivacySettings = true;
  }

  closePrivacySettings(): void {
    this.showPrivacySettings = false;
  }

  savePrivacySettings(): void {
    // Guarda la configuración de privacidad en localStorage o en el servidor

    if(this.privacySettings.tracking == false && this.privacySettings.personalization == false){

      this.showPrivacySettings = false;
      this.showPopup = false;

      this.showAccessDeniedMessageSettings= true;
    }
    else{

      localStorage.setItem('privacySettings', JSON.stringify(this.privacySettings));
      localStorage.removeItem('privacyRejected');
      localStorage.removeItem('privacyAccepted');

      this.showPrivacySettings = false;
      this.showAccessDeniedMessageSettings= false;
      this.showPopup = false;

    }

  }
}
