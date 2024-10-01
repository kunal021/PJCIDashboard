/* eslint-disable react/prop-types */
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import DeleteDir from "./DeleteDir";
import UpdateDir from "./UpdateDir";
import { useState } from "react";

function Actions({
  children,
  id,
  setDirData,
  name,
  directoryType,
  parentId,
  contentType,
  directoryTypeId,
}) {
  const [openUpdate, setOpenUpdate] = useState(false);
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onSelect={() => setOpenUpdate(true)}
            className="text-blue-500"
          >
            Update
          </ContextMenuItem>
          <ContextMenuItem>
            <DeleteDir id={id} setDirData={setDirData} />
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {openUpdate && (
        <UpdateDir
          name={name}
          directoryType={directoryType}
          parentId={parentId}
          contentType={contentType}
          directoryTypeId={directoryTypeId}
          id={id}
          onClose={() => setOpenUpdate(false)} // Control closing of the sheet
        />
      )}
    </>
  );
}

export default Actions;
