import Link from "next/link";
import React, { FunctionComponent } from "react";
import styles from "./BlogCard.module.scss";

interface BlogCardProps {
  image: string;
  date: string;
  readDuration: string;
  title: string;
  excerpt: string;
  url: string;
}

const BlogCard: FunctionComponent<BlogCardProps> = props => {
  const { title, image, excerpt, date, readDuration, url } = props;
  return (
    <Link href={url || "#"}>
      <a className={`${styles["blog-card"]}`}>
        <div className={styles["img-wrapper"]}>
          <img
            className={styles["flower-image"]}
            src={image}
            alt="featured flower"
          />
        </div>
        <div className={styles.detail}>
          <div className="flex between center-align">
            <span className={styles.date}>{date}</span>
            <span className={styles.duration}>{readDuration}</span>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <span className={[styles.subtitle, "normal-text"].join(" ")}>
            {excerpt}
          </span>
          <span className={styles.continue}>
            <strong className="red margin-right">Continue Reading</strong>
            <img
              alt="arrow"
              className="generic-icon xsmall"
              src="/icons/arrow-right.svg"
            />
          </span>
        </div>
      </a>
    </Link>
  );
};

export default BlogCard;
