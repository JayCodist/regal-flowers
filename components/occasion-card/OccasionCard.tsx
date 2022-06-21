import Link from "next/link";
import { FunctionComponent } from "react";
import styles from "./OccasionCard.module.scss";

interface OccasionCardProps {
  title: string;
  image: string;
  className?: string;
  url: string;
}

const OccasionCard: FunctionComponent<OccasionCardProps> = props => {
  const { title, image, className, url } = props;
  return (
    <Link href={url}>
      <a className={[styles["occasion-card"], className].join(" ")}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <span className="flex spaced smaller center-align">
            <h3 className={styles.explore}>Explore</h3>
            <img
              alt="arrow"
              className="generic-icon xsmall"
              src="/icons/arrow-right-white.svg"
            />
          </span>
        </div>
        <img alt={title} className={styles.img} src={image} />
      </a>
    </Link>
  );
};

export default OccasionCard;
