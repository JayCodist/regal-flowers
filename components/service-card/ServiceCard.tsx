import { FunctionComponent } from "react";
import styles from "./ServiceCard.module.scss";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  image: string;
  className?: string;
  size?: "default" | "small";
}

const ServiceCard: FunctionComponent<ServiceCardProps> = props => {
  const { title, subtitle, image, className, size } = props;
  return (
    <div
      className={[
        styles["service-card"],
        styles[size || "default"],
        className
      ].join(" ")}
    >
      <img alt={title} className={styles.img} src={image} />
      <div className={styles.description}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.subtitle}>{subtitle}</span>
      </div>
    </div>
  );
};

export default ServiceCard;
