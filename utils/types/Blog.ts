

interface Blog {
  id: string;
  title: string;
  featuredImage: string;
  /**
    * The body is going to be created 
    * using WYSIWYG editor so you can
    * attach it as `dangerouslySetInnerHTML`
  */
  body: string;
  category: string;
  createdAt: string;
  lastUpdatedAt: string;
  readMinutes: number;
  slug: string;
}

export default Blog