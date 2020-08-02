import { UI } from './ui.model';

export const input: UI = {
  generateApp: true,
  projectName: 'myapi',
  srcFolder: 'src',
  entities: [
    {
      name: 'book',
      fields: [
        {
          name: 'title',
          type: 'String',
          required: true
        },
        {
          name: 'isbn',
          type: 'Number',
          unique: true
        },
        {
          name: 'author',
          type: 'ObjectId',
          ref: 'user'
        },
        {
          name: 'isPublished',
          type: 'Boolean'
        },
        {
          name: 'cover',
          type: 'ObjectId',
          ref: 'mediaObject'
        },
        {
          name: 'images',
          type: [
            {
              type: 'ObjectId',
              ref: 'mediaObject'
            }
          ]
        },
        {
          name: 'publishedAt',
          type: 'Date',
          required: true
        },
        {
          name: 'tags',
          type: [
            {
              type: 'String'
            }
          ]
        },
      ],
      timestamps: true,
      populate: true
    }
  ],
  swaggerDocs: true,
  swaggerPath: 'myapi/swagger.yaml'
};
