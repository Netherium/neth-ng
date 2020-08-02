import { MediaObject } from '../../models/media-object.model';

export interface Product {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  manufactureDate?: Date;
  images?: MediaObject[];
  createdAt?: Date;
  updatedAt?: Date;
}
