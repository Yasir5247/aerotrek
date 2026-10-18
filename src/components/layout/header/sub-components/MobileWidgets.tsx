
const MobileWidgets = () => {
  return (
    <div className="mb-[35px] mt-auto text-black/[0.68] sm:max-md:mb-[30px]">
      <div className="mb-5">
        <div className="basis-1/3">
          <ul className="m-0 list-none p-0">
            <li className="mr-6 inline-block last:mr-0">
              <i className="fa fa-phone mr-1.5 text-base" />{" "}
              <a className="text-black/[0.68] hover:text-[#5a5a5a]" href="tel://+9607890988">
                (+960) 7890988
              </a>
            </li>
            <li className="mr-6 inline-block last:mr-0">
              <i className="fa fa-envelope mr-1.5 text-base" />{" "}
              <a
                className="text-black/[0.68] hover:text-[#5a5a5a]"
                href="mailto:aerotrek.mv@gmail.com"
              >
                aerotrek.mv@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <a
          className="mr-2.5 text-sm text-black/[0.68] first:ml-0 hover:text-[#5a5a5a] sm:max-md:mr-2.5"
          href="https://www.facebook.com/profile.php?id=61565429427775"
          title="Facebook"
        >
          <i className="fa fa-facebook"></i>
        </a>
        <a
          className="mr-2.5 text-sm text-black/[0.68] hover:text-[#5a5a5a]"
          href="https://www.instagram.com/aerotrekmv/"
          title="Instagram"
        >
          <i className="fa fa-instagram"></i>
        </a>
        <a
          className="mr-2.5 text-sm text-black/[0.68] hover:text-[#5a5a5a]"
          href="https://www.tiktok.com/@aerotrek"
          title="TikTok"
        >
          <i className="fa-brands fa-tiktok"></i>
        </a>
      </div>
    </div>
  );
};

export default MobileWidgets;
