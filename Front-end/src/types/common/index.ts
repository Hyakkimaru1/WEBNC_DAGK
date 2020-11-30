export interface ASYNC_ACTION_TYPE {
  data?: { [key: string]: any };
  params?: { [key: string]: any };
  cbSuccess?: (...args: Array<any>) => any;
  cbError?: (url: string, error: any) => any;
}

export type HTTP_METHOD_TYPE =
  | "POST"
  | "GET"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "PUT"
  | "LINK"
  | "UNLINK"
  | undefined;

export interface REQUEST_TYPE {
  url: string;
  method: HTTP_METHOD_TYPE;
  payload?: { [key: string]: any };
  params?: { [key: string]: any };
  cbSuccess?: (...args: Array<any>) => any;
  cbError?: (url: string, error: any) => any;
  LOADING_ACTION: string;
  SUCCESS_ACTION: string;
  ERROR_ACTION: string;
}

interface ROUTE {
  path: string;
  exact: boolean;
  roles?: Array<string>;
  component: React.FC;
  pageName: string;
  shouldClearStore?: boolean;
}
export type ROUTERS = Array<ROUTE>;

export interface REDUX_ACTION {
  type?: string;
  payload?: any;
}

export type REQUEST_INFO = {
  label: string;
  fieldName: string;
  type: string;
  value?: any;
  defaulValue?: string;
  formValidation: Object;
};

export interface STEP {
  id: string;
  name: string;
  priority: number;
  processDefinitionKey: string;
  startTime: string;
  endTime?: string;
  taskDefinitionKey: number;
}

export interface REQUEST_TYPE_ITEM {
  id: string;
  key: string;
  name: string;
  requestName: string;
  startForm: REQUEST_INFO[];
  startableInTasklist: boolean;
  suspended: boolean;
  version: number;
}

export interface ENV_INFO {
  [env: string]: { BASE_URL: string };
}

export interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}
