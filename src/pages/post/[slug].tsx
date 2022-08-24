import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import { dataFormat } from '../../helpers/dataFormat';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header />
      <div className={commonStyles.container}>
        <img
          src={post.data.banner.url}
          className={styles.banner}
          alt={post.data.title}
        />
        <span className={styles.postTitle}>{post.data.title}</span>
        <div className={styles.postInfo}>
          <div className={commonStyles.postData}>
            <FiCalendar />
            <span>{dataFormat(post.first_publication_date)}</span>
          </div>
          <div className={commonStyles.postData}>
            <FiUser />
            <span>{post.data.author}</span>
          </div>
          <div className={commonStyles.postData}>
            <FiClock />
            <span>4 min</span>
          </div>
        </div>
      </div>

      <div className={commonStyles.container}>
        {post.data.content.map(content => (
          <div key={content.heading}>
            <p className={styles.postContentTitle}>{content.heading}</p>
            {content.body.map(body => (
              <p className={styles.postContentText} key={body.text}>
                {body.text}
              </p>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  return {
    paths: posts.results.map(post => ({
      params: {
        slug: post.uid,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});

  const response = await prismic.getByUID('posts', params.slug);

  return {
    props: {
      post: response,
    },
    revalidate: 1,
  };
};
