const Section = ({
  title,
  children,
  className,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={`flex flex-grow relative sm:items-center ${
        className ? className : ""
      }`}
    >
      <div className="flex-grow  flex sm:items-center items-start flex-row">
        <div className=" flex flex-col flex-grow  mt-6 sm:mt-0 gap-2">
          {title && (
            <h2 className="font-bold title-font text-gray-900 mb-1 text-xl">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
