import { useSearchParams } from "react-router-dom";

export const useTableUrl = (defaultSize: number) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = Number(searchParams.get("page") || 1) - 1;
  const pageSize = Number(searchParams.get("limit") || defaultSize);
  
  const urlFilters = Object.fromEntries(searchParams.entries());
  delete urlFilters.page;
  delete urlFilters.limit;

const updateUrl = (newParams: Record<string, any>) => {
  const params = new URLSearchParams(searchParams);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === "" || value === undefined || value === null) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  setSearchParams(params, { replace: true });
};

  return { pageIndex, pageSize, urlFilters, updateUrl };
};