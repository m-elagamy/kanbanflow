import { Layout, Database, UserCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TermsOfService = () => (
  <section className="space-y-4">
    <Card>
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="flex items-center text-lg">
          <Layout className="mr-2 h-5 w-5" />
          Kanban Board Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="usage">
            <AccordionTrigger>
              <span className="flex items-center text-sm font-medium">
                Acceptable Use
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  Use boards and tasks for legitimate project management
                  purposes
                </li>
                <li>Respect intellectual property rights</li>
                <li>Do not store content that violates applicable laws</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="limitations">
            <AccordionTrigger>
              <span className="flex items-center text-sm font-medium">
                Service Limitations
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>Service availability is not guaranteed</li>
                <li>
                  Potential service interruptions for maintenance or upgrades
                </li>
                <li>Right to modify or discontinue features with notice</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="px-4 pt-4 pb-2">
        <CardTitle className="flex items-center text-lg">
          <Database className="mr-2 h-5 w-5" />
          Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-3 text-sm">
          <li className="flex items-center">
            <UserCircle className="mr-2 size-5 text-blue-500" />
            <span>
              You retain full ownership of all data you input into the
              application
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  </section>
);

export default TermsOfService;
