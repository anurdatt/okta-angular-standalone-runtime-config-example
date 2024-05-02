import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tag-view',
  standalone: true,
  imports: [],
  templateUrl: './tag-view.component.html',
  styleUrl: './tag-view.component.scss',
})
export class TagViewComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log('Route Params:', params);
    });
  }
}
