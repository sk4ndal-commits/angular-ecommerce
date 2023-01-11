import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mein-callback',
  templateUrl: './mein-callback.component.html',
  styleUrls: ['./mein-callback.component.scss']
})
export class MeinCallbackComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("mein callback works");
  }

}
