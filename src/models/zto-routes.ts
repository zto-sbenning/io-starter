export interface ZtoRouteContext {
  id?: string;
  idx?: number;
  show?: boolean;
  name?: string;
  icon?: string;
}

export interface ZtoRouteContexts {
  [id: string]: ZtoRouteContext;
}

export interface ZtoRoute {
  id?: string;
  page?: any;
  contexts?: ZtoRouteContexts;
}

export interface ZtoRoutes {
  [id: string]: ZtoRoute;
}
