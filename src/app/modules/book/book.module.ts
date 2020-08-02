import { NgModule } from '@angular/core';

import { BookComponent } from './book.component';
import { BookDialogComponent } from './book-dialog/book-dialog.component';
import { SharedModule } from '../../shared.module';
import { BookRoutingModule } from './book-routing.module';

@NgModule({
  declarations: [BookComponent, BookDialogComponent],
  imports: [
    SharedModule,
    BookRoutingModule
  ],
  entryComponents: [BookDialogComponent]
})
export class BookModule {
}
