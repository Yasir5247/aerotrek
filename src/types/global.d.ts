declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "swiper/react" {
  export const Swiper: any;
  export const SwiperSlide: any;
}

declare module "swiper";

declare module "react-hooks-paginator" {
  const Paginator: any;
  export default Paginator;
}
