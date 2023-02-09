const mg = require('mongoose')
const slugify = require('slugify')

const slugifyOptions = {
  replacement: '_',
  lower: true,
  strict: true,
  trim: true
}

const postSchema = mg.Schema({
  author: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true,
    minLength: 10
  },

  slugg: {
    type: String,
    required: [true, 'The slugg is required. It is the title of your post.'],
    unique: true,
    set: (slugg) => { return slugify(slugg, slugifyOptions) }
  },

  comments: [
    {
      author: {
        type: String,
        required: true
      },

      body: {
        type: String,
        required: true,
        minLength: 10
      },

      createdAt: {
        type: Date,
        required: true,
        default: Date.now
      },

    }
  ]

}, {
  timestamps: true
})

postSchema.set('toObject', { getters: true });
postSchema.set('toJSON', { getters: true });

const Post = mg.model('Post', postSchema)
module.exports = Post