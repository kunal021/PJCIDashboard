/* eslint-disable react/prop-types */
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { useState } from "react";
import Delete from "./Delete";
import Update from "./Update";

function Actions({
  children,
  id,
  news,
  setNews,
  is_active,
  handleChangeStatus,
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
            <Delete id={id} news={news} setNews={setNews} />
          </ContextMenuItem>
          <ContextMenuItem>
            <div className="flex flex-col justify-center items-center">
              <p className="text-xs font-bold">
                {is_active === "1" ? "Public" : "Private"}
              </p>
              <button
                onClick={() => handleChangeStatus(id, is_active)}
                className="toggle-switch scale-75 align-middle"
              >
                <input type="checkbox" checked={is_active == "1"} readOnly />
                <div className="toggle-switch-background">
                  <div className="toggle-switch-handle"></div>
                </div>
              </button>
            </div>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {openUpdate && (
        <Update
          data={news.find((item) => item.id == id)}
          setData={setNews}
          onClose={() => setOpenUpdate(false)} // Control closing of the sheet
        />
      )}
    </>
  );
}

export default Actions;
