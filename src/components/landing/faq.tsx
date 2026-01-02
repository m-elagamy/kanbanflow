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
      <div className="mb-6 flex items-center justify-center">
        <Badge
          variant="outline"
          className="border-primary/20 bg-primary/5"
          icon={<HelpCircle className="h-3.5 w-3.5" />}
        >
          FAQ
        </Badge>
      </div>
      <div className="mb-16 flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-gradient text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed md:text-lg">
          Everything you need to know about KanbanFlow
        </p>
      </div>
      <div className="mx-auto max-w-4xl">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border/50 bg-card/30 hover:bg-card/50 rounded-lg border px-4 transition-all duration-200"
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
