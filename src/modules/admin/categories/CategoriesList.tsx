import { ScrollArea } from "@/modules/core/components/ui/scroll-area";
import clsx from "clsx";
import { BaseCategory } from "./Categories";
import CategoriesListDialog from "./CategoriesListDialog";

interface CategoriesListProps {
  data: BaseCategory[];
}

const CategoriesListItem = ({
  data,
  depth,
}: {
  data: BaseCategory;
  depth: number;
}) => {
  return (
    <div className={clsx("ml-4", `pl-${depth * 3}`)}>
      {data?.children?.length === 0 && !!data?.attributes?.length ? (
        <CategoriesListDialog attributes={data.attributes}>
          <p className={clsx(depth === 1 && `font-bold`, "underline")}>
            {data.name}
          </p>
        </CategoriesListDialog>
      ) : (
        <p className={clsx(depth === 1 && `font-bold`)}>{data.name}</p>
      )}
      {data?.children &&
        data.children.map((childData) => (
          <CategoriesListItem
            data={childData}
            depth={depth + 1}
            key={childData.id}
          />
        ))}
    </div>
  );
};

const CategoriesList = ({ data }: CategoriesListProps) => {
  return (
    <div>
      <ScrollArea className="h-72">
        {data.map((category) => (
          <CategoriesListItem key={category.id} data={category} depth={1} />
        ))}
      </ScrollArea>
    </div>
  );
};
export default CategoriesList;
