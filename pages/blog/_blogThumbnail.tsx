import React from 'react'

export interface ThumbnailProps {
  imageUrl: string,
  tag: string,
  title: string

}
import styles from './blog.module.scss'

const BlogThumbnail = (props: ThumbnailProps) => {
  const { imageUrl, tag, title } = props
  return (
    <div className="flex between center-align vertical-margin spaced" >
      <div>
        <img src={imageUrl} alt="" className={`${styles["trend-img"]} margin-right spaced`} />
      </div>
      <div className="">
        <p className={styles["tag"]}>{tag}</p>
        <p className='text-medium semibold'>{title}</p>
      </div>
    </div>
  )
}

export default BlogThumbnail