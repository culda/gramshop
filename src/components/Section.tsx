const Section = ({
  title,
  children,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
}) => {
  return (
    <section className="flex flex-grow relative pb-10 sm:items-center">
      <div className="flex-grow  flex sm:items-center items-start flex-row">
        <div className=" flex flex-col flex-grow sm:pl-6 mt-6 sm:mt-0 gap-2">
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
