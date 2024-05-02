import { Component, OnInit, OnDestroy } from '@angular/core';
import { Tag } from '../blogs/model/tag';
import { TagListComponent } from './tag-list/tag-list.component';
import {
  ActivatedRoute,
  NavigationEnd,
  // NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { TagsService } from './tags.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  of as observableOf,
  Subscription,
  filter,
  map,
  mergeMap,
  distinctUntilChanged,
  BehaviorSubject,
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TagViewComponent } from './tag-view/tag-view.component';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TagListComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent implements OnInit, OnDestroy {
  // tags: Tag[] = [
  //   {
  //     id: 'Technology-15551',
  //     name: 'Technology',
  //   },
  //   {
  //     id: 'Science-67698',
  //     name: 'Science',
  //   },
  //   {
  //     id: 'Software-76977',
  //     name: 'Software',
  //   },
  //   {
  //     id: 'Programming-15791',
  //     name: 'Programming',
  //   },
  //   {
  //     id: 'Arts-15443',
  //     name: 'Arts',
  //   },
  //   {
  //     id: 'Mythology-45234',
  //     name: 'Mythology',
  //   },
  //   {
  //     id: 'Life-23343',
  //     name: 'Life',
  //   },
  // ];

  isLoadingResults = true;
  fetchedTags$: BehaviorSubject<Tag[]> | undefined = new BehaviorSubject([]);

  selectedTagId: string = null;
  fetchTagsSubscription: Subscription;
  // navStartEventSubscription: Subscription;
  navEventSubscription: Subscription;
  fetchedTagsSubscription: Subscription;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  tagListDivScrollLeft = 0;
  tagListDivOffsetWidth = 0;
  tagListDivScrollWidth = 0;
  tagListDivScrollLeftAllowed = false;
  tagListDivScrollRightAllowed = true;

  constructor(
    private route: ActivatedRoute,
    private tagsService: TagsService,
    private _snackbar: MatSnackBar,
    private router: Router
  ) {}

  cb = (e: Event) => {
    // console.log(e.target['scrollLeft'], e.target['scrollTop'], e.target['scrollWidth'], e.target['clientWidth'], e.target['offsetWidth']);
    this.tagListDivScrollLeft = e.target['scrollLeft'];
    this.tagListDivScrollWidth = e.target['scrollWidth'];
    this.tagListDivOffsetWidth = e.target['offsetWidth'];
    this.tagListDivScrollLeftAllowed = this.tagListDivScrollLeft > 0;
    this.tagListDivScrollRightAllowed =
      this.tagListDivScrollLeft + this.tagListDivOffsetWidth <
      this.tagListDivScrollWidth;
  };

  scroll(by: number) {
    const el = document.getElementById('scrollingDiv');
    el.scrollLeft += by;
    // el.scrollBy({left: el.scrollLeft + by});
  }

  scrollToLeft(left: number): void {
    const el = document.getElementById('scrollingDiv');
    el.scrollLeft = left;
  }

  scrollTo(tagId: string): void {
    setTimeout(() => {
      const el = document.getElementById('scrollingDiv');
      const section = el.querySelector(`#${tagId}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 10);
  }

  ngOnInit() {
    console.log('In ngOninit()');

    // this.navStartEventSubscription = this.router.events
    //   .pipe(
    //     filter((event) => event instanceof NavigationStart),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((e) => {
    //     console.log({ e });
    //     this.fetchedTags$.next([]);
    //   });

    // Subscribe to router events to detect navigation changes
    this.navEventSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        // distinctUntilChanged(),
        map(() => this.route.firstChild),
        // map((route) => {
        //   console.log({ route });
        //   while (route.firstChild) {
        //     route = route.firstChild;
        //     console.log({ route });
        //   }
        //   return route;
        // }),
        mergeMap((route) => route.paramMap),
        map((params) => params.get('id')),
        distinctUntilChanged() // Filter out consecutive duplicate values
      )
      .subscribe((id) => {
        //(params) => {
        // Access route parameters here
        // const id = params.get('id');
        console.log('Merge Route ID:', id);
        // Process route parameters as needed
        this.fetchedTagsSubscription?.unsubscribe();
        if (!id) {
          this.selectedTagId = null;
          this.fetchAllTags(false);
          this.fetchedTagsSubscription = this.fetchedTags$
            .asObservable()
            .subscribe((tags) => this.scrollToLeft(0)); //this.scrollTo('all-tags'));
        } else {
          if (!this.selectedTagId) {
            this.selectedTagId = id;
            this.fetchTagsRelatedTo(id, true);
          } else {
            this.selectedTagId = id;
          }
          this.fetchedTagsSubscription = this.fetchedTags$
            .asObservable()
            .subscribe(() => this.scrollTo(id));
        }
      });

    // Subscribe to route params observable of the parent route
    // this.route.params.subscribe((params) => {
    //   const id = params['id'];
    //   console.log('Route ID:', id);
    // });

    console.log('ActivatedRoute Snapshot:', this.route.snapshot);

    if (!this.selectedTagId) {
      const tagId = this.route.snapshot.firstChild?.params['id'];
      if (!tagId) {
        this.selectedTagId = null;
        this.fetchAllTags(false);
      } else {
        this.selectedTagId = tagId;
        this.fetchTagsRelatedTo(tagId, true);
      }
    }

    // if (
    //   this.route.firstChild?.component ==
    //   this.route.routeConfig.children[1].component
    // ) {
    //   // Subscribe to route params observable to get access to the child route params
    //   this.route.firstChild?.paramMap.subscribe((params) => {
    //     const tagId = params.get('id');
    //     console.log('Child Route ID:', tagId);
    //     // if (!tagId) this.fetchAllTags();
    //     // else {
    //     this.selectedTagId = tagId;
    //     this.fetchTagsRelatedTo(tagId);
    //     // }
    //   });
    // } else {
    //   this.fetchAllTags();
    // }

    // setInterval(() => this.count += 10, 1000);
    const el = document.getElementById('scrollingDiv');
    console.log({ el });
    el.addEventListener('scroll', this.cb);
    // el.addEventListener('click', (e) =>
    //   alert(`You clicked at x = ${e.clientX}`)
    // );
    // el.addEventListener(
    //   'resize',
    //   (e) => {
    //     console.log('You resized');
    //     alert(`You resized`);
    //   },
    //   true
    // );
  }

  fetchTagsRelatedTo(tagId: string, bringToFront: boolean) {
    //TODO: recommended fetch using specific tagid.
    this.fetchAllTags(bringToFront); //For now simply all tags.
  }

  fetchAllTags(bringToFront: boolean) {
    this.isLoadingResults = true;

    this.fetchTagsSubscription = this.tagsService
      .findAll()
      .pipe(
        catchError((err) => {
          console.error(
            'FindAll tags failed with error : ' + JSON.stringify(err)
          );
          return observableOf(null);
        })
      )
      .subscribe((tags: Tag[]) => {
        this.isLoadingResults = false;
        if (tags == null) {
          console.error('Tags fetch failed..');

          // this._snackbar.open('Error occured in loading Tags!', 'Failure', {
          //   // panelClass: ['alert', 'alert-failure'],
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          // });
        } else {
          // this.allTags = tags;

          // this._snackbar.open('Load tags completed successfully!', 'Success', {
          //   // panelClass: ['alert', 'alert-success'],
          //   horizontalPosition: this.horizontalPosition,
          //   verticalPosition: this.verticalPosition,
          //   duration: 1000,
          // });

          if (bringToFront && this.selectedTagId != null) {
            const selectedTagIndex = tags.findIndex(
              (tag) => tag.id === this.selectedTagId
            );
            if (selectedTagIndex >= 0)
              this.fetchedTags$.next(
                tags.splice(selectedTagIndex, 1).concat(tags)
              );
          } else {
            this.fetchedTags$.next(tags);
          }
        }
      });
  }

  ngOnDestroy() {
    console.log('In ngOnDestroy');
    const el = document.getElementById('scrollingDiv');
    console.log({ el });
    el.removeEventListener('scroll', this.cb);

    this.fetchTagsSubscription?.unsubscribe();
    // this.navStartEventSubscription?.unsubscribe();
    this.navEventSubscription?.unsubscribe();
    this.fetchedTagsSubscription?.unsubscribe();
  }

  // ngAfterViewInit(): void {
  //   // const el = document.getElementById('scrollingDiv')
  //   // console.log({el});
  //   // el.addEventListener('scroll', this.cb, true);

  // }
}
