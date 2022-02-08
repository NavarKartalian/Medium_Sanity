export interface PostsProps {
  author: {
    image: {
      asset: {
        _ref: string;
      }
    }
    name: string;
  }
  description: string;
  title: string;
  _id: string;
  publishedAt: string;
  mainImage: {
    asset: {
      _ref: string;
    }
  }
  slug: {
    current: string;
  }
}[];

export interface Props {
  post: {
    author: {
      image: {
        asset: {
          _ref: string;
        }
      }
      name: string;
    }
    body: {}[];
    description: string;
    title: string;
    _id: string;
    publishedAt: string;
    mainImage: {
      asset: {
        _ref: string;
      }
    }
    slug: {
      current: string;
    }
    comments: {
      approved: boolean;
      comment: string;
      email: string;
      name: string;
      post: {
        _ref: string;
        _type: string;
      }
      createdAt: string;
      _id: string;
      _rev: string;
      _type: string;
      _updatedAt: string;
    }[]
  }
}