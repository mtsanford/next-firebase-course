import { getDocs, where, orderBy, limit, collection, query } from 'firebase/firestore';

import { getUserWithUsername, postToJSON } from "../../lib/firebase";
import UserProfile from "../../components/UserProfile";
import Metatags from "../../components/Metatags";
import PostFeed from "../../components/PostFeed";

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  console.log(userDoc.data())

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsRef = collection(userDoc.ref, "posts");
    const postsQuery = query(postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const qs = await getDocs(postsQuery);
    posts = qs.docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <Metatags
        title={user.username}
        description={`${user.username}'s public profile`}
      />
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  );
}
