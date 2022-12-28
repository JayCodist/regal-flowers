import React from "react";
import BlogCard from "../components/blog-card/BlogCard";
import FlowerCard from "../components/flower-card/FlowerCard";
import { blogPosts, popularSections } from "../utils/constants";
import useDeviceType from "../utils/hooks/useDeviceType";
import styles from "./404.module.scss";

function Custom404() {
  const deviceType = useDeviceType();
  return (
    <section className="">
      <img src="/images/404.svg" alt="404" className={styles["hero-img"]} />
      <div className={styles["popular-sections"]}>
        <h2 className={styles.title}>Popular Sections</h2>
        <div className={[styles.section, styles.wrap].join(" ")}>
          {popularSections.map(section => (
            <FlowerCard
              key={section.title}
              image={section.image}
              name={section.title}
              url={section.url}
              mode="six-x-grid"
              onlyTitle
            />
          ))}
        </div>
        {deviceType === "desktop" && (
          <div className="featured-content">
            <h2 className="featured-title text-center margin-bottom spaced">
              Our Blog
            </h2>
            <div className={styles.section}>
              {blogPosts.map(post => (
                <BlogCard
                  key={post.title}
                  title={post.title}
                  readDuration={post.readDuration}
                  date={post.date}
                  image={post.image}
                  excerpt={post.excerpt}
                  url="#"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Custom404;
