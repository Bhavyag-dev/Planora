import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "../lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  key?: React.Key;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      className={cn(
        "group rounded-lg border border-neutral-200 bg-white",
        "transition-all duration-200 ease-in-out",
        isOpen
          ? "border-blue-600 shadow-xs"
          : "hover:bg-neutral-50/50",
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4.5 flex items-center justify-between gap-4 cursor-pointer"
      >
        <h3
          className={cn(
            "text-base font-medium transition-colors duration-200 text-left text-neutral-700",
            isOpen && "text-neutral-950",
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="p-0.5 rounded-full shrink-0 text-neutral-400 transition-colors duration-200"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.4,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.25,
                },
              },
            }}
          >
            <div className="px-6 pb-5 pt-1.5">
              <motion.p
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="text-xs text-neutral-500 leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq02() {
  const faqs: Omit<FAQItemProps, "index">[] = [
    {
      question: "Is Planora free to use?",
      answer:
        "Yes! Planora is 100% free for hosting free events with unlimited RSVPs. For paid ticketed events, we charge a flat 5% commission per ticket transaction with zero setup costs.",
    },
    {
      question: "How does multi-workspace support work?",
      answer:
        "Planora allows you to create separate workspaces for different organizations (e.g. Acme Corp, local meetups, or personal clubs). Each workspace isolates events, member roles, and settings.",
    },
    {
      question: "Can I invite team members to co-host events?",
      answer:
        "Absolutely. As a workspace owner, you can enter any team member's email in the dashboard roster. They will be added as a collaborator to co-manage the events feed.",
    },
    {
      question: "Are there limit counts on attendees?",
      answer:
        "No! Planora supports events of all scales. You can specify a custom seat limit when scheduling an event, and registrations will close automatically once the capacity is filled.",
    },
  ];

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20 border-t border-neutral-100/80">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12 space-y-2"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-500">Everything you need to know about our platform</p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto mt-12 text-center"
        >
          <Mail className="h-5 w-5 text-neutral-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-neutral-900 mb-1">Still have questions?</p>
          <p className="text-xs text-neutral-500 mb-5">We're here to help you</p>
          <a
            href="mailto:support@planora.events"
            className="inline-flex px-5 py-2.5 text-xs rounded-md bg-neutral-950 hover:bg-neutral-800 text-white transition-colors duration-200 font-medium cursor-pointer"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
