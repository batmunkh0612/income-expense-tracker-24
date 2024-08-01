import axios from "axios";

const Blog = () => {
  axios.get('http://localhost:8000/').then((res) => {
    console.log(res);
  })
  return <div>Blog</div>;
};

export default Blog;
