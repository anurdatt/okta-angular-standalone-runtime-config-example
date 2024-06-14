import { Component, OnInit } from '@angular/core';
import { RECEIPT_ID } from '../../app.constants';
import { CommonUtil } from '../../shared/CommonUtil';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss',
})
export class ReceiptComponent implements OnInit {
  util: CommonUtil = new CommonUtil();
  receiptId: string;
  constructor() {}

  ngOnInit(): void {
    console.log(localStorage.getItem(RECEIPT_ID));
    console.log(this.util.Decrypt(localStorage.getItem(RECEIPT_ID)));
    this.receiptId = //JSON.stringify(
      this.util.Decrypt(localStorage.getItem(RECEIPT_ID)).receipt;
    // );
  }
}
