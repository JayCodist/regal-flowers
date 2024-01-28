import React, { useState, useContext, FormEvent, FunctionComponent } from 'react'
import styles from './blog.module.scss'
import articleStyles from './article.module.scss'
import { GetStaticProps } from "next";
import Button from '../../components/button/Button'
import Input from '../../components/input/Input'
import { subscribeToNewsletter } from '../../utils/helpers/data/core'
import SettingsContext from '../../utils/context/SettingsContext'
import { blogCategories, blogMinimals } from '../../utils/constants'
import { trendingPosts } from '../../utils/constants'
import BlogThumbnail from './_blogThumbnail'
import { getProductsBySlugs } from '../../utils/helpers/data/products';
import { featuredSlugs } from '../../utils/constants';
import Product from '../../utils/types/Product';
import FlowerCard from '../../components/flower-card/FlowerCard';
import useDeviceType from '../../utils/hooks/useDeviceType';
import { getBlog, getAllBlogs } from '../../utils/helpers/data/blog';


const BlogPost: FunctionComponent<{ featuredFlowers: Product[], blog: Blog }> = ({ featuredFlowers, blog }) => {
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { notify } = useContext(SettingsContext);
  const handleEmailSubscription = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    const { error, message } = await subscribeToNewsletter(subscriptionEmail);
    setIsSubscribing(false);
    if (error) {
      notify("error", `Unable to subscribe email: ${message}`);
      return;
    }
    notify("success", "Successfully subscribed to newsletter");
  };

  const device = useDeviceType();
  const markup = { __html: blog.body };
  return (
    <section className={styles["blog-post"]}>


      <div className={styles["blog-body"]}>
        <div className={styles["content"]}>
          <div className={styles["hero-header"]}>
            <p className={styles["title"]}>{blog.title}</p>
            <div className={styles["header-details"]}>

              <div className={`${styles["info"]} text-medium`}>
                <p><span className={styles["blog-date"]}>7 Dec, 2021 / </span> <span className={styles["last-updated"]}> Updated 4 hours ago</span></p>
                <p><span className={styles["read-duration"]}>{blog.readMinutes} minutes read </span> <span className={styles["tag"]}> Everything Flowers & Gift</span></p>
              </div>
            </div>
            <div className={styles["hero-img"]}>
              <img src={blog.featuredImage} alt="featured-image" />
            </div>
          </div>
          <article className={`text-small ${articleStyles["article"]}`} dangerouslySetInnerHTML={markup}>
          </article>

          <div className={styles["subscribe-section"]}>
            <div className="flex column between">
              <div className="flex column spaced">
                <h2 className="featured-title unspaced bold">
                  Get Amazing Updates Right Into Your Inbox.
                </h2>
                <div className="grayed">
                  Stay in the loop with everything you need to know.
                </div>
              </div>
              <div className={styles["subscribe-form-wrapper"]}>
                <form
                  className={`flex spaced responsive`}
                  onSubmit={handleEmailSubscription}
                >
                  <Input
                    value={subscriptionEmail}
                    onChange={setSubscriptionEmail}
                    className="full-width"
                    placeholder="Enter email address"
                    required
                    type="email"
                    name="email"
                  />
                  <Button buttonType="submit" loading={isSubscribing}>
                    SUBSCRIBE
                  </Button>

                </form>
                <span className="grayed semibold">We care about your data in our privacy policy</span>

              </div>
            </div>
          </div>
        </div>
        <div className={styles["side"]}>
          <div className={styles["trending"]}>
            <hr />
            <p>Trending Posts</p>
            <hr />
          </div>
          {trendingPosts.map((tag, index) => (
            <BlogThumbnail
              imageUrl={tag.imageUrl}
              tag={tag.tag}
              title={tag.title}
              key={index}

            />
          ))}
          <div className={styles["trending"]}>
            <hr />
            <p>Blog Categories</p>
            <hr />
          </div>
          {blogCategories.map((category, index) => (
            <div key={index} className={styles.category}>
              <span
                className={[
                  styles["list-bullet"],
                  styles[category.bulletColor]
                ].join(" ")}
              ></span>
              <p className="text-medium">{category.title}</p>
            </div>
          ))}
          <div className={styles["trending"]}>
            <hr />
            <p>Recent Posts</p>
            <hr />
          </div>
          {trendingPosts.map((tag, index) => (
            <BlogThumbnail
              imageUrl={tag.imageUrl}
              tag={tag.tag}
              title={tag.title}
              key={index}

            />
          ))}


          {
            device === 'mobile' && (
            <>
              <div className={styles["trending"]}>
                <hr />
                <p>Featured Flowers</p>
                <hr />
              </div>

              <div className={styles["popular-sections"]}>
                <div className={[styles.section, styles.wrap].join(" ")}>
                  {featuredFlowers?.map(flower => (
                    <FlowerCard
                      key={flower.key}
                      image={flower.images[0]?.src || ""}
                      name={flower.name}
                      subTitle={flower.subtitle || flower.name.split("–")[1]}
                      price={flower.price}
                      url={`/product/${flower.slug}`}
                      buttonText="Add to Cart"
                      cart={flower.variants?.length ? false : true}
                      product={flower}
                      mode='two-x-grid'
                    />
                  ))}
                </div>

              </div>
            </>
            )
          }

        </div>

      </div>

      {device === 'desktop' && (
        <div className={styles["popular-sections"]}>
          <h2 className={`${styles.title} vertical-margin spaced normal`}>
            FEATURED FLOWERS
          </h2>
          <div className={[styles.section, styles.wrap].join(" ")}>
            {featuredFlowers?.map(flower => (
              <FlowerCard
                key={flower.key}
                image={flower.images[0]?.src || ""}
                name={flower.name}
                subTitle={flower.subtitle || flower.name.split("–")[1]}
                price={flower.price}
                url={`/product/${flower.slug}`}
                buttonText="Add to Cart"
                cart={flower.variants?.length ? false : true}
                product={flower}
              />
            ))}
          </div>

        </div>
      )}

    </section>
  )
}

export default BlogPost

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { blogSlug } = params || {}
  const { data: featuredFlowers, } = await getProductsBySlugs(
    featuredSlugs["featured-birthday"]
  );
  const { data, error, message } = await getBlog(String(blogSlug));
  if (error || !data) {
    console.error(`Unable to fetch product "${blogSlug}": ${message}`);
    return {
      props: {
        blog: {
        }
      },
      revalidate: 1800
    };
  }
  return {
    props: {
      blog: data,
      featuredFlowers: featuredFlowers || []
    },
    revalidate: 1800
  };
};

export const getStaticPaths = async () => {
  const { data, error } = await getAllBlogs();
  const slugs = data?.map(blog => ({
    params: { blogSlug: blog.slug }
  }));

  if (error) {
    console.error(`Unable to fetch products: ${error}`);
    return {
      paths: [],
      fallback: false
    };
  } else {
    return {
      paths: slugs,
      fallback: false // true or 'blocking'
    };
  }

};