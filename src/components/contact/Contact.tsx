"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import Breadcrumb from "@/components/layout/breadcrumb/Breadcrumb";
import Container from "@/components/ui/Container";

const Contact = () => {
  const pathname = usePathname();

  return (
    <Fragment>
      <Breadcrumb
        variant="modern"
        containerClass="w-full"
        pages={[
          { label: "Home", path: "/" },
          { label: "Contact", path: pathname },
        ]}
      />
      <div className="pt-[35px] pb-[35px]">
        <div className="w-full">
          <div className="mx-auto max-w-[1140px]">
            <div className="mx-auto mb-8 max-w-[700px] text-center">
              <p className="mb-2.5 block w-full text-xs font-bold tracking-[0.12em] text-[rgba(17,17,17,0.62)] uppercase">
                Contact AeroTrek
              </p>
              <h1 className="mb-3 text-[clamp(30px,5vw,44px)] leading-[1.12] text-[#111]">
                We are here to help you travel smarter.
              </h1>
              <p className="m-0 leading-[1.75] text-[rgba(17,17,17,0.7)]">
                Questions about products, delivery, returns, or bulk orders?
                Our team usually replies within one business day.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:max-lg:grid-cols-1 lg:grid-cols-[minmax(280px,0.95fr)_minmax(320px,1.35fr)]">
              <div>
                <Container className="!p-0">
                  <div className="px-7 py-[38px] max-md:px-[18px] max-md:py-[26px]">
                  <div className="group mb-10 flex items-center last:mb-0">
                    <div className="mr-5">
                      <i className="fa fa-phone inline-block h-10 w-10 rounded-full border border-[#252525] text-center text-xl leading-10 text-[#252525] transition duration-300 group-hover:bg-[#252525] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="mb-2 leading-none text-[#404040]">+960 789 0988</p>
                      <p className="m-0 leading-none text-[#404040]">Sun - Fri, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  <div className="group mb-10 flex items-center last:mb-0">
                    <div className="mr-5">
                      <i className="fa fa-envelope-o inline-block h-10 w-10 rounded-full border border-[#252525] text-center text-xl leading-10 text-[#252525] transition duration-300 group-hover:bg-[#252525] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="m-0 leading-none text-[#404040]">
                        <a
                          className="text-[#404040] hover:text-[#5a5a5a]"
                          href="mailto:aerotrek.mv@gmail.com"
                        >
                          aerotrek.mv@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="group flex items-center">
                    <div className="mr-5">
                      <i className="fa fa-map-marker inline-block h-10 w-10 rounded-full border border-[#252525] text-center text-xl leading-10 text-[#252525] transition duration-300 group-hover:bg-[#252525] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="mb-2 leading-none text-[#404040]">Male, Maldives</p>
                      <p className="m-0 leading-none text-[#404040]">Nationwide Delivery Available</p>
                    </div>
                  </div>
                  </div>
                </Container>
              </div>
              <div>
                <Container className="!p-0">
                  <div className="px-[34px] py-[38px] max-md:px-[18px] max-md:py-7">
                  <div className="mb-[30px]">
                    <h2 className="mb-2.5 text-[30px] leading-[1.2] text-[#111]">Send us a message</h2>
                    <p className="m-0 leading-[1.7] text-[rgba(17,17,17,0.68)]">
                      Tell us what you need and we will connect you with the right team member.
                    </p>
                  </div>
                  <form>
                    <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-12">
                      <div className="lg:col-span-6">
                        <input
                          className="mb-4 h-[46px] w-full rounded-xl border border-[rgba(17,17,17,0.17)] bg-white px-4 py-1"
                          name="name"
                          placeholder="Full Name*"
                          type="text"
                        />
                      </div>
                      <div className="lg:col-span-6">
                        <input
                          className="mb-4 h-[46px] w-full rounded-xl border border-[rgba(17,17,17,0.17)] bg-white px-4 py-1"
                          name="email"
                          placeholder="Email*"
                          type="email"
                        />
                      </div>
                      <div className="lg:col-span-12">
                        <input
                          className="mb-4 h-[46px] w-full rounded-xl border border-[rgba(17,17,17,0.17)] bg-white px-4 py-1"
                          name="subject"
                          placeholder="Subject*"
                          type="text"
                        />
                      </div>
                      <div className="lg:col-span-12">
                        <textarea
                          className="mb-0 min-h-[150px] w-full rounded-xl border border-[rgba(17,17,17,0.17)] bg-white px-4 py-3.5"
                          name="message"
                          placeholder="How can we help?*"
                          defaultValue=""
                        />
                        <button
                          className="mt-[18px] rounded-full bg-[#111] px-[52px] py-[15px] text-sm font-medium tracking-[0.05em] text-white uppercase transition-colors hover:bg-[#5a5a5a]"
                          type="submit"
                        >
                          SEND MESSAGE
                        </button>
                      </div>
                    </div>
                  </form>
                  <p className="text-[#333]" />
                  </div>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Contact;
