import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import UploadModal from "@/components/ui/upload";
import { Upload } from "lucide-react";

export default function Train() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <Card className="w-[350px] px-4">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name of your model" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Type</Label>
                <Select>
                    <SelectTrigger id="name" className="w-full">
                        <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Man">Man</SelectItem>
                      <SelectItem value="Woman">Woman</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Age</Label>
                <Input id="name" placeholder="Age" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Ehinicity</Label>
                <Select>
                    <SelectTrigger id="name" className="w-full">
                        <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Asian_American">Asian American</SelectItem>
                      <SelectItem value="East_Asian">East Asian</SelectItem>
                      <SelectItem value="South_East_Asian">South East Asian</SelectItem>
                        <SelectItem value="South_Asian">South Asian</SelectItem>
                      <SelectItem value="Middle_Eastern">Middle Eastern</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Eye Color</Label>
                <Select>
                  <SelectTrigger id="name" className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Brown">Brown</SelectItem>
                      <SelectItem value="Blue">Blue</SelectItem>
                      <SelectItem value="Hazel">Hazel</SelectItem>
                      <SelectItem value="Gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>  

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Bald</Label>
                <Switch />
              </div>
              <UploadModal />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Create Model</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
