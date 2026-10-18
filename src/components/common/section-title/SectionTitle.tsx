import PropTypes from "prop-types";
import clsx from "clsx"

const SectionTitle = ({ titleText,
  subtitleText,
  subtitleColorClass,
  positionClass,
  spaceClass,
  borderClass }: { titleText?: any; subtitleText?: any; subtitleColorClass?: any; positionClass?: any; spaceClass?: any; borderClass?: any }) => {
  return (
    <div className={clsx("text-center", positionClass, spaceClass, borderClass)}>
      <h2 className="relative m-0 inline-block text-[30px] font-semibold max-md:text-2xl max-md:leading-[30px] before:absolute before:left-[-100px] before:top-[17px] before:h-0.5 before:w-20 before:bg-black before:content-[''] after:absolute after:right-[-100px] after:top-[17px] after:h-0.5 after:w-20 after:bg-black after:content-[''] max-md:before:left-[-40px] max-md:before:w-[30px] max-md:after:right-[-40px] max-md:after:w-[30px]">
        {titleText}
      </h2>
      <p className={clsx("mt-2.5 text-base font-normal", subtitleColorClass)}>
        {subtitleText}
      </p>
    </div>
  );
};

SectionTitle.propTypes = {
  borderClass: PropTypes.string,
  positionClass: PropTypes.string,
  spaceClass: PropTypes.string,
  subtitleText: PropTypes.string,
  subtitleColorClass: PropTypes.string,
  titleText: PropTypes.string
};

export default SectionTitle;
