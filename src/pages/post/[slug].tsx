import { GetStaticPaths, GetStaticProps } from "next";
import { sanityClient, urlFor } from "../../../sanity";
import Head from 'next/head';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from "react";
import { PostsProps, Props } from "../../types";

interface IformInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

export default function Post({ post }: Props) {
  const [ submitted, setSubmitted ] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<IformInput>();

  const onSubmit: SubmitHandler<IformInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(() => {
      setSubmitted(true);
    }).catch((errors) => {
      console.log(errors);
      setSubmitted(false);
    })
  };

  return (
    <>
      <Head>
        <title>{post.author.name} | {post.title}</title>
      </Head>
      <main>
        <img 
          className="w-full h-60 object-cover"
          src={urlFor(post.mainImage.asset._ref).url()!}
          alt="Main post image" 
        />

        <article className="max-w-3xl mx-auto p-5 mb-2">
          <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
          <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>

          <div className="flex items-center space-x-2">
            <img 
              className="w-10 h-10 rounded-full mb-2"
              src={urlFor(post.author.image.asset._ref).url()!} 
              alt='Author profile pic' 
            />
            <p className="font-extralight text-sm">
              Blog post by <span className="text-green-600 font-bold">{post.author.name} </span> 
              - Published at {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-10">
            <PortableText
              content={post.body}
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
              serializers={
                {
                  h1: (props: any) => (
                    <h1 className="text-2xl font-bold my-5" {...props} />
                  ),
                  h2: (props: any) => (
                    <h2 className="text-xl font-bold my-5" {...props} />
                  ),
                  li: ({ children }: any) => (
                    <li className="list-disc ml-4">{children}</li>
                  ),
                  link: ({ href, children }: any) => (
                    <a className="text-blue-500 hover:underline" href={href}>
                      {children}
                    </a>
                  ),
                }
              }
            />
          </div>
        </article>

        <hr className="max-w-lg mx-auto border-yellow-500 my-5" />

        {submitted ? (
          <div className="flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold">
              Thank you for submitting your comment!
            </h3>

            <p>
              Once approved, it will appear below!
            </p>
          </div>
        ) : (
          <>
            <form className="flex flex-col p-5 my-10 max-w-2xl mx-auto mb-10" onSubmit={handleSubmit(onSubmit)}>
              <h3 className="text-sm text-yellow-500">Enjoy this article?</h3>
              <h4 className="text-3xl font-bold">Leave a comment below!</h4>
              <hr className="py-3 mt-2" />

              <input
                {...register("_id")}
                type={'hidden'}
                name={'_id'}
                value={post._id}
              />

              <label className="block mb-5">
                <span className="text-gray-700">Name</span>
                <input 
                  {...register('name', {required: true})}
                  className="shadow border rounded py-2 px-3 form-input mt-1 
                    block w-full outline-none ring-yellow-500 focus:ring" 
                  placeholder="John Appleseed" 
                  type="text" 
                />
              </label> 

              <label className="block mb-5">
                <span className="text-gray-700">Email</span>
                <input 
                  {...register('email', {required: true})}
                  className="shadow border rounded py-2 px-3 form-input mt-1 
                    block w-full outline-none ring-yellow-500 focus:ring" 
                  placeholder="example@email.com" 
                  type="email" 
                />
              </label>  

              <label className="block mb-5">
                <span className="text-gray-700">Comment</span>
                <textarea 
                  {...register('comment', {required: true})}
                  className="shadow border rounded py-2 px-3 form-textarea mt-1 
                    block w-full outline-none ring-yellow-500 focus:ring resize-none" 
                  placeholder="Type your comment" 
                  rows={8} 
                />
              </label>

              <div className="flex flex-col p-5">
                {errors.name && (
                  <span className="text-red-500">The name field is required</span>
                )}

                {errors.email && (
                  <span className="text-red-500">The email field is required</span>
                )}

                {errors.comment && (
                  <span className="text-red-500">The comment field is required</span>
                )}
              </div>

              <input 
                className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline 
                  focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer" 
                type="submit" 
              />         
            </form>
          </>
        )}

        <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
          <h3 className="text-4xl">Comments</h3>
          <hr className="pb-2" />

          {post.comments?.map(comment => (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}: </span>{comment.comment}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug{
    current
  }
  }`;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: PostsProps ) => ({
    params: {
      slug: post.slug.current
    }
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    body,
    description,
    publishedAt,
    mainImage,
    author -> {
    name,
    image
  },
  'comments': *[
    _type == 'comment' &&
    post._ref == ^._id &&
    approved == true
  ],
  }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if(!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60,
  }
}
