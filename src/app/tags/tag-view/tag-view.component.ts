import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TagsService } from '../tags.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tag-view',
  standalone: true,
  imports: [],
  templateUrl: './tag-view.component.html',
  styleUrl: './tag-view.component.scss',
})
export class TagViewComponent implements OnInit, OnDestroy {
  id: string;
  tagName: string;

  queryParamSubscription: Subscription;
  pathParamSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService
  ) {}

  ngOnInit() {
    this.pathParamSubscription = this.route.params.subscribe((params) => {
      console.log('Route Params:', params);
      this.id = params['id'];
    });

    this.queryParamSubscription = this.route.queryParams.subscribe((p) => {
      console.log(p['name']);
      this.tagName = p['name'];
    });
  }

  ngOnDestroy(): void {
    this.pathParamSubscription?.unsubscribe();
    this.queryParamSubscription?.unsubscribe();
  }
}
