import { useContext } from "react";
import { doc, collection, collectionGroup, getDoc, getDocs } from 'firebase/firestore';
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { UserContext } from "../../lib/context";

import PostContent from "../../components/PostContent";
import HeartButton from "../../components/HeartButton";
import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";

import styles from "../../styles/Post.module.css";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(collection(userDoc.ref, "posts"), slug);
    post = postToJSON(await getDoc(postRef));

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const cg = collectionGroup(firestore, "posts")
  const snapshot = await getDocs(cg);

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`} passHref>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}
