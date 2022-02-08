import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { sanityClient, urlFor } from '../../sanity';
import { Banner } from '../components/Banner';

interface HomeProps {
  posts: {
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
    _createdAt: string;
    mainImage: {
      asset: {
        _ref: string;
      }
    }
    slug: {
      current: string;
    }
  }[];
}

export default function Home({ posts }: HomeProps) {
  return (
    <>
      <Head>
        <title>Medium 2.0</title>
      </Head>

      <div className='max-w-7xl mx-auto'>
        <Banner />

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
          {posts.map(post => (
            <Link key={post._id} href={`/post/${post.slug.current}`} passHref>
              <div className='group cursor-pointer border rounded-lg overflow-hidden'>
                {post.mainImage.asset._ref &&
                  <img 
                    className='h-60 w-full object-cover group-hover:scale-105 
                    transition-transform duration-200 ease-in-out'
                    src={ urlFor(post.mainImage.asset._ref).url()! } 
                    alt='Post main image' 
                  />}

                <div className='flex justify-between p-5 bg-white'>
                  <div>
                    <p className='text-lg font-bold'>{post.title}</p>
                    <p className='text-sm'>{post.description}</p>
                  </div>
                  
                  <img 
                    className='w-12 h-12 rounded-full'
                    src={ urlFor(post.author.image.asset._ref).url()! } 
                    alt="Author profile pic" 
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    slug,
    description,
    mainImage,
    author -> {
    name,
    image
  }
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }
}
