import { ShieldCheck, Lock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PrivacyPolicy = () => (
  <section className="space-y-6">
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <ShieldCheck className="mr-2 size-5" />
          Data Protection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="collection">
            <AccordionTrigger>
              <span className="flex items-center text-sm font-medium">
                Information We Collect
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>User account information</li>
                <li>Board names and content</li>
                <li>Task details and assignments</li>
                <li>Usage statistics</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="usage">
            <AccordionTrigger>
              <span className="flex items-center text-sm font-medium">
                How We Use Your Data
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>Personalizing your Kanban experience</li>
                <li>Improving task management features</li>
                <li>Personalizing user experience</li>
                <li>Analyzing app usage patterns</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Lock className="mr-2 h-5 w-5" />
          Security Measures
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Secured, and encrypted authentication{" "}
          </li>
          <li className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Industry-standard security practices
          </li>
          <li className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Secure authentication methods
          </li>
        </ul>
      </CardContent>
    </Card>
  </section>
);

export default PrivacyPolicy;
