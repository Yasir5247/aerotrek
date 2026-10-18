import PropTypes from "prop-types";
import React, { Fragment } from "react";

const ProductRating = ({ ratingValue }: { ratingValue?: any }) => {
  const parsedRating = Number.parseFloat(ratingValue);
  const normalizedRating = Number.isFinite(parsedRating)
    ? Math.max(0, Math.min(5, parsedRating))
    : 0;

  const rating: any[] = [];

  for (let i = 0; i < 5; i++) {
    const starIndex = i + 1;

    if (normalizedRating >= starIndex) {
      rating.push(<i className="fa fa-star yellow" key={i} />);
    } else if (normalizedRating >= starIndex - 0.5) {
      rating.push(<i className="fa fa-star-half-o yellow" key={i} />);
    } else {
      rating.push(<i className="fa fa-star-o" key={i} />);
    }
  }

  return <Fragment>{rating}</Fragment>;
};

ProductRating.propTypes = {
  ratingValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default ProductRating;
