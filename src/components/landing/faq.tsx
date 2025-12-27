import { HelpCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { faqs } from "./data";

export default function FAQ() {
  return (
    <>
      <div className="mb-4 flex items-center justify-center">
        <Badge
          variant="secondary"
          icon={<HelpCircle className="h-3.5 w-3.5" />}
        >
          FAQ
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 pb-12 text-center">
        <h2 className="text-gradient text-2xl font-bold tracking-tighter md:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about KanbanFlow
        </p>
      </div>
      <div className="mx-auto max-w-4xl pb-16">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-muted-foreground/20"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
