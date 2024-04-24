export type TableParams = {
  search?: string;
  limit?: number;
  offset?: number;
  sort?: {
    field: string;
    direction: string;
  };
};
