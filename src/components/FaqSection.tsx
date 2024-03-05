import { useState } from "react";

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left">
        <div className="p-4 shadow-xl rounded-md">
          <h3 className="font-semibold text-lg text-gray-800">{question}</h3>
          <div
            className={`${
              isOpen ? "" : "hidden"
            } mt-2 p-4 text-gray-600 rounded-md`}
          >
            <p>{answer}</p>
          </div>
        </div>
      </button>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Gramshop?",
      answer:
        "Gramshop is an innovative app designed to help eCommerce shop owners import their shop into Telegram, opening up a new sales channel to Telegram’s 800 million active users. It leverages Telegram’s mini webapps, allowing users to shop without leaving the app.",
    },
    {
      question: "Who is Gramshop for?",
      answer:
        "Gramshop is ideal for any eCommerce shop owner looking to expand their sales channels and tap into Telegram’s vast user base. Whether you sell clothing, electronics, handmade goods, or anything else online, Gramshop can help you reach more customers.",
    },
    {
      question: "How long is the onboarding process?",
      answer:
        "The onboarding process is quick and efficient, taking just 2 minutes. You’ll need to create a bot within Telegram and link your preferred payment provider, such as Stripe, to get started.",
    },
    {
      question: "How do I get paid?",
      answer:
        "Payments are processed through your chosen payment provider, such as Stripe, which will deposit your earnings directly into your bank account. This setup is part of the onboarding process.",
    },
    {
      question: "Do I need an existing audience on Telegram?",
      answer:
        "No, you don’t need an existing audience on Telegram to get started with Gramshop. Our platform is designed to help you leverage your current eCommerce platform and introduce it to a new audience on Telegram.",
    },
    {
      question: "Can I import my shop from any eCommerce platform?",
      answer:
        "Yes, Gramshop is compatible with any eCommerce platform that allows you to export your product catalog in CSV format. Our AI-powered tools will parse your CSV file to create a seamless shopping experience on Telegram.",
    },
    {
      question: "How is shopping on Telegram with Gramshop different?",
      answer:
        "Shopping on Telegram with Gramshop provides a unique, integrated experience. Thanks to Telegram’s mini webapps, customers can browse and purchase your products without ever leaving the app, offering a seamless shopping experience that can boost sales and customer satisfaction.",
    },
  ];

  return (
    <div id="faq" className="max-w-2xl mx-auto px-8">
      <h2 className="text-3xl font-bold mb-4">Frequently asked questions.</h2>
      <p className="mb-8">
        {" "}
        If you have any other questions, please reach out via{" "}
        <a href="mailto:culda@proton.me" target="_blank">
          <b>email</b>
        </a>
        . Alternatively, check out the Telegram channel in the footer.
      </p>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
