import { Component, OnInit } from '@angular/core';
import { RECEIPT_ID } from '../../app.constants';
import { CommonUtil } from '../../shared/CommonUtil';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss',
})
export class ReceiptComponent implements OnInit {
  util: CommonUtil = new CommonUtil();
  receiptId: string;
  constructor(private location: Location) {}

  ngOnInit(): void {
    const receiptRaw = localStorage.getItem(RECEIPT_ID);
    console.log(receiptRaw);
    if (receiptRaw == null) {
      this.location.back();
    }

    const receiptObj = this.util.Decrypt(receiptRaw);
    console.log(receiptObj);
    this.receiptId = receiptObj.receipt; //JSON.stringify(
    // );
    // localStorage.removeItem(RECEIPT_ID);

    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}
