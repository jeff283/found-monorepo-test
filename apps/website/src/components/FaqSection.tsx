"use client";

import { useState } from "react";
// import { IoIosArrowRoundForward } from 'react-icons/io'
import { FiPlus, FiMinus } from "react-icons/fi";
import FoundlyButton from "@/components/FoundlyButton";
import { Button } from "@/components/ui/button";

type FaqItem = {
  question: string;
  answer: string;
};

const faqData: FaqItem[] = [
  {
    question: "How does Foundly’s AI matching work?",
    answer:
      "Foundly uses advanced machine learning algorithms to analyze item descriptions, photos, and location data. Our system identifies potential matches between lost items and found reports with remarkable accuracy, even when descriptions are vague or incomplete.",
  },
  {
    question: "Is Foundly available for individual users or just institutions?",
    answer:
      "Foundly is designed for both individual users and institutions. Whether you’ve lost a personal item or manage a facility with a lost & found department, our platform offers tools tailored to your needs.",
  },
  {
    question: "How secure is my personal information?",
    answer:
      "We take privacy and security seriously. All personal data is encrypted and only accessible to authorized users. Foundly adheres to strict data protection standards to ensure your information stays safe and private.",
  },
  {
    question:
      "What makes Foundly different from traditional lost & found systems?",
    answer:
      "Traditional systems rely on manual logs and limited matching methods. Foundly uses AI-powered smart matching, real-time alerts, mobile-first access, and intuitive dashboards to automate and optimize the entire process.",
  },
  {
    question: "When will Foundly be available?",
    answer:
      "Foundly is currently in development with pilot testing underway. We plan to launch our platform to the public in the coming months. Stay tuned through our website and social media channels for updates.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      className="w-[95%] mx-auto bg-secondary rounded-3xl py-16 px-4"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-white font-semibold text-2xl mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-white text-sm">
            Everything you need to know about Foundly. Find quick answers to
            common queries below
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 transition-all duration-300 ${
                openIndex === index ? "bg-[#245581]" : "bg-[#245581]"
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleIndex(index)}
              >
                <h3 className="text-white font-medium">{item.question}</h3>
                <div className="text-white text-2xl">
                  {openIndex === index ? <FiMinus /> : <FiPlus />}
                </div>
              </div>

              {openIndex === index && (
                <p className="mt-4 text-white text-sm leading-relaxed">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <FoundlyButton
            text="Ask Question"
            href="#"
            variant="default" // or "secondary", "outline", etc. if needed
          />
        </div>
        <div className="mt-2 flex justify-center">
          <Button
            asChild
            variant="link"
            size="sm"
            className="text-xs text-muted hover:text-primary"
          >
            <a
              href="https://chatgpt.com/?hints=search&q=Read+https%3A%2F%2Ffoundlyhq.com%2Fllms.txt"
              target="_blank"
              rel="noopener noreferrer"
            >
              Not finding your answer? Ask ChatGPT about Foundly
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
