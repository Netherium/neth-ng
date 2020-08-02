import { MediaObject } from '../../models/media-object.model';
import { User } from '../user/user.model';

export interface Book {
  _id: string;
  title?: string;
  isbn?: number;
  author?: User;
  isPublished?: boolean;
  cover?: MediaObject;
  images?: MediaObject[];
  publishedAt?: Date;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
