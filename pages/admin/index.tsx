import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { serverTimestamp, collection, query, orderBy, doc, setDoc } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import kebabCase from 'lodash.kebabcase';

import { UserContext } from '../../lib/context';
import { firestore, auth } from '../../lib/firebase';
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";

import styles from '../../styles/Admin.module.css';

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const userPosts = collection(firestore, "users", auth.currentUser.uid, "posts");
  const q = query(userPosts, orderBy("createdAt"));
  const [querySnapshot] = useCollection(q);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();

    const uid = auth.currentUser.uid;
    const newPostRef = doc(firestore, "users", auth.currentUser.uid, "posts", slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(newPostRef, data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
