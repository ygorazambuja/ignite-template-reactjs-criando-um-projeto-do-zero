import { GetStaticProps, GetStaticPropsResult } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Header from '../components/Header';
import { dataFormat } from '../helpers/dataFormat';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [nextPosts, setNextPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );

  const router = useRouter();

  const loadMore = async (): Promise<void> => {
    try {
      const response = await fetch(nextPage);
      const data = await response.json();

      setNextPage(data.next_page);

      const posts: Post[] = data.results.map(
        post =>
          ({
            uid: post.uid,
            data: {
              author: post.data.author,
              title: post.data.title,
              subtitle: post.data.subtitle,
            },
            first_publication_date: post.first_publication_date,
          } as Post)
      );

      setNextPosts(prevState => [...prevState, ...posts]);
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div>
      <Header />
      <div className={commonStyles.container}>
        {nextPosts.map(post => (
          <div
            key={post.uid}
            className={styles.postContainer}
            onClick={() =>
              router.push(`/post/${post.uid}`, `/post/${post.uid}`, {})
            }
          >
            <div className={styles.postTitle}>{post.data.title}</div>
            <div className={styles.postSubtitle}>{post.data.subtitle}</div>
            <div className={styles.postFooter}>
              <div className={commonStyles.postData}>
                <FiCalendar />
                <span>{dataFormat(post.first_publication_date)}</span>
              </div>
              <div className={commonStyles.postAuthor}>
                <FiUser />
                {post.data.author}
              </div>
            </div>
          </div>
        ))}

        {nextPage && (
          <button type="button" onClick={loadMore} className={styles.highlight}>
            Carregar mais posts
          </button>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
