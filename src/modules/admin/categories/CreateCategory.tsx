import { Button } from "@/modules/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/core/components/ui/dialog";
import { ScrollArea } from "@/modules/core/components/ui/scroll-area";
import { Category } from "./Categories";
import CreateCategoryForm from "./CreateCategoryForm";

interface CreateCategoryProps {
  data: Category[];
}

const CreateCategory = ({ data }: CreateCategoryProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Utwórz kategorię</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Utwórz kategorię</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <ScrollArea scrollHideDelay={0} className="max-h-[80vh] pr-4">
          <CreateCategoryForm data={data} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default CreateCategory;
