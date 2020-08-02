import { Component, Inject } from '@angular/core';
import { Book } from '../book.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpGenericService } from '../../../services/http-generic.service';
import { SubscriptionNotificationService } from '../../../services/subscription-notification.service';
import { Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../../models/role.model';
import { User } from '../../user/user.model';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html'
})
export class BookDialogComponent {
  isLoading = false;
  book: Book;

  // TODO Add for each ObjectId
  authorChangedSub: Subject<string> = new Subject<string>();
  isLoadingAuthors: boolean;
  filteredAuthors: Observable<User[]>;

  authorChanged(text: string) {
    this.authorChangedSub.next(text);
  }

  authorDisplayFn(user: User): string {
    if (user) {
      return user.name;
    }
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { action: string; book: Book }, private httpService: HttpGenericService,
              public dialogRef: MatDialogRef<BookDialogComponent>, public dialog: MatDialog, private subNotSrv: SubscriptionNotificationService) {
    console.log('data received in dialog', data)
    if (data.action === 'update') {
      this.book = {...data.book};
    }
    if (data.action === 'create') {
      this.book = data.book
    }
    this.filteredAuthors = this.authorChangedSub.pipe(
      filter(term => !!term && typeof term === 'string'),
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => (this.isLoadingAuthors = true)),
      switchMap((term: string) => this.httpService.listPaginatedCollection<User>('users', null, 0, 5, term)
        .pipe(
          map(data => data.data),
          finalize(() => this.isLoadingAuthors = false)
        )
      )
    )

  }

  save() {
    console.log(this.book);
    this.isLoading = true;
    let obs: Observable<Book | HttpErrorResponse>;
    if (this.data.action === 'create') {
      obs = this.httpService.create<Book>('books', this.book);

    } else {
      obs = this.httpService.update<Book>('books', this.book);
    }

    // @ts-ignore
    this.subNotSrv.createSubscription<Book>(obs, this.data.action, 'Book', () => {
      this.dialogRef.close();
    }, () => {
      this.isLoading = false;
    });

  }
}
