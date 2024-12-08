import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PrivacyPolicy from "./privacy-policy";
import TermsOfService from "./terms-of-service";

export function LegalDocumentModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="px-1 pr-0">
          Terms of Service
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-1 text-2xl font-bold">
            <FileText className="size-6" />
            Legal Documents
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="privacy">
          <TabsList className="w-full rounded-none px-6 *:transition-colors dark:bg-primary-foreground">
            <TabsTrigger value="privacy" className="flex-1">
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex-1">
              Terms of Service
            </TabsTrigger>
          </TabsList>
          <TabsContent value="privacy" className="mt-0">
            <ScrollArea className="h-[60vh] p-6">
              <PrivacyPolicy />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="terms" className="mt-0">
            <ScrollArea className="h-[60vh] p-6">
              <TermsOfService />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
