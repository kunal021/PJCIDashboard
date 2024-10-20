/* eslint-disable react/prop-types */
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { useNavigate } from "react-router-dom";

function Breadcrumbs({ data, handleNavigate }) {
  // const navigate = useNavigate();
  const renderBreadcrumbs = (items) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <BreadcrumbItem className="flex justify-center items-center">
          {/* {item.parentId ? (
            <BreadcrumbLink href={`/get-course-videos?id=${item.id}`}>
              {item.name}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{item.name}</BreadcrumbPage>
          )} */}
          <BreadcrumbLink
            onClick={() => handleNavigate(item.id, item.name, item.parentId)}
            className="cursor-pointer text-center pb-1"
          >
            {item.name}
          </BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        {/* {index < items.length - 1 && <BreadcrumbSeparator />} */}
        {item.children &&
          item.children.length > 0 &&
          renderBreadcrumbs(item.children)}
      </React.Fragment>
    ));
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbs(data)}</BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
