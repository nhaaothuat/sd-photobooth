import React from "react";
import { Button } from "@mantine/core";
import AxiosAPI from "@/configs/axios";
import { useToast } from "@/hooks/use-toast";


interface ExportButtonProps {
  endpoint: string;
  filename: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ endpoint, filename }) => {
  const {toast} = useToast();
  const handleExport = async () => {
    try {
      const response = await AxiosAPI.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data as any], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

     
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        className: "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Error", // Thay thế t("errorTitle")
        description: "An error occurred", // Thay thế t("errorDesc")
      })
    }
  };

  return (
    <Button onClick={handleExport} variant="filled" color="blue">
      Export to CSV
    </Button>
  );
};

export default ExportButton;
