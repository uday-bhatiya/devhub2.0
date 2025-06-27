import { CheckCircle2Icon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";

const CustomAlert = ({ msg }: { msg: string }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Alert className="bg-green-100 border-[#7A83FF] text-black shadow-lg">
        <CheckCircle2Icon className="mr-2 h-5 w-5" />
        <AlertTitle>{msg}</AlertTitle>
      </Alert>
    </div>
  );
};

export default CustomAlert;